import { NextResponse } from "next/server";
import { createHash } from "crypto";
import type { RowDataPacket } from "mysql2/promise";
import {
  AUTH_COOKIE_NAME,
  type UserRole,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from "@/utils/auth/auth";
import { queryMySql, executeMySql } from "@/utils/db/client";

type LoginRequestBody = {
  email?: string;
  password?: string;
  mode?: string;
};

type UserRow = RowDataPacket & {
  email: string;
  password_hash: string;
  role: UserRole;
};

async function upsertRefreshToken(userEmail: string, token: string): Promise<void> {
  const existing = await queryMySql<RowDataPacket & { token: string }>(
    `SELECT token FROM refresh_tokens WHERE user_email = ? LIMIT 1`,
    [userEmail]
  );

  if (existing.rows.length > 0) {
    await executeMySql(`UPDATE refresh_tokens SET token = ?, created_at = CURRENT_TIMESTAMP WHERE user_email = ?`, [token, userEmail]);
    return;
  }

  await executeMySql(
    `INSERT INTO refresh_tokens (user_email, token, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [userEmail, token]
  );
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function ensureAuthTables() {
  await executeMySql(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await executeMySql(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL UNIQUE,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (user_email)
    )
  `);

  // Backward-compatible migration for existing databases created before roles.
  try {
    await executeMySql(`
      ALTER TABLE users
      ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
    `);
  } catch {
    // Column likely already exists.
  }
}

function isSignupMode(mode?: string): boolean {
  return (mode ?? "login") === "signup";
}

async function parseBody(request: Request): Promise<LoginRequestBody> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as LoginRequestBody;
  }

  const formData = await request.formData();
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    mode: String(formData.get("mode") ?? "login"),
  };
}

export async function POST(request: Request) {
  try {
    const isJsonRequest = (request.headers.get("content-type") ?? "").includes("application/json");
    const { email, password, mode } = await parseBody(request);

    if (!email || !password) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: 400,
          message: "Email and password are required",
          data: null,
          exception: [],
        },
        { status: 400 }
      );
    }

    await ensureAuthTables();

    const userRows = await queryMySql<UserRow>(`SELECT email, password_hash, role FROM users WHERE email = ? LIMIT 1`, [email]);
    const existing = userRows.rows[0];

    if (isSignupMode(mode)) {
      if (existing) {
        return NextResponse.json(
          {
            isApiHandled: true,
            isRequestSuccess: false,
            statusCode: 409,
            message: "User already exists",
            data: null,
            exception: [],
          },
          { status: 409 }
        );
      }

      const passwordHash = hashPassword(password);
      await executeMySql(`
        INSERT INTO users (email, password_hash, role, created_at)
        VALUES (?, ?, 'user', CURRENT_TIMESTAMP)
      `, [email, passwordHash]);

      const accessToken = signAccessToken(email, "user");
      const refreshToken = signRefreshToken(email, "user");

      await upsertRefreshToken(email, refreshToken);

      const response = isJsonRequest
        ? NextResponse.json({
            isApiHandled: true,
            isRequestSuccess: true,
            statusCode: 200,
            message: "Success",
            data: {
              accessToken,
              refreshToken,
              email,
              role: "user",
            },
            exception: [],
          })
        : NextResponse.redirect(new URL("/", request.url));

      setAuthCookies(response, { email, role: "user" }, accessToken, refreshToken);
      return response;
    }

    if (!existing) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: 401,
          message: "Invalid credentials",
          data: null,
          exception: [],
        },
        { status: 401 }
      );
    }

    const match = hashPassword(password) === String(existing.password_hash);
    if (!match) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: 401,
          message: "Invalid credentials",
          data: null,
          exception: [],
        },
        { status: 401 }
      );
    }

    const role: UserRole = existing.role ?? "user";
    const accessToken = signAccessToken(email, role);
    const refreshToken = signRefreshToken(email, role);

    await upsertRefreshToken(email, refreshToken);

    const response = isJsonRequest
      ? NextResponse.json({
          isApiHandled: true,
          isRequestSuccess: true,
          statusCode: 200,
          message: "Success",
          data: {
            accessToken,
            refreshToken,
            email,
            role,
          },
          exception: [],
        })
      : NextResponse.redirect(new URL("/", request.url));

    setAuthCookies(response, { email, role }, accessToken, refreshToken);
    return response;

  } catch (error) {
    console.error("[Auth Login] Unexpected error:", error);
    return NextResponse.json(
      {
        isApiHandled: false,
        isRequestSuccess: false,
        statusCode: 500,
        message: "Unexpected error",
        data: null,
        exception: [],
      },
      { status: 500 }
    );
  }
}
