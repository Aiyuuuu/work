import {
  REFRESH_COOKIE_NAME,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  parseCookies,
  type UserRole,
  verifyRefreshToken,
} from "@/utils/auth/auth";
import { queryMySql, executeMySql } from "@/utils/db/client";
import type { RowDataPacket } from "mysql2/promise";
import { NextResponse } from 'next/server';

type RefreshRequestBody = {
  refreshToken?: string;
  accessToken?: string;
};

type RefreshTokenRow = RowDataPacket & {
  token: string;
};

type UserRoleRow = RowDataPacket & {
  role: UserRole;
};

async function ensureRefreshTokenTable() {
  await executeMySql(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL UNIQUE,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (user_email)
    )
  `);
}

async function parseBody(request: Request): Promise<RefreshRequestBody> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as RefreshRequestBody;
  }

  const formData = await request.formData();
  return {
    refreshToken: String(formData.get("refreshToken") ?? ""),
    accessToken: String(formData.get("accessToken") ?? ""),
  };
}

export async function PUT(request: Request) {
  try {
    const body = await parseBody(request);
    const cookies = parseCookies(request.headers.get("cookie") ?? "");
    const refreshToken = body.refreshToken || cookies[REFRESH_COOKIE_NAME] || undefined;

    if (!refreshToken) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: 401,
          message: "Refresh token missing",
          data: null,
          exception: [],
        },
        { status: 401 }
      );
    }

    await ensureRefreshTokenTable();

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: 401,
          message: "Invalid refresh token",
          data: null,
          exception: [],
        },
        { status: 401 }
      );
    }

    // ensure refresh token exists in DB for this user
    const rows = await queryMySql<RefreshTokenRow>(`SELECT token FROM refresh_tokens WHERE user_email = ? LIMIT 1`, [payload.email]);
    const stored = rows.rows[0];

    if (!stored || String(stored.token) !== String(refreshToken)) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: 401,
          message: "Refresh token not found",
          data: null,
          exception: [],
        },
        { status: 401 }
      );
    }

    let userRole: UserRole = "user";
    try {
      const userRows = await queryMySql<UserRoleRow>(`SELECT role FROM users WHERE email = ? LIMIT 1`, [payload.email]);
      userRole = userRows.rows[0]?.role ?? "user";
    } catch {
      userRole = "user";
    }

    const newAccessToken = signAccessToken(payload.email, userRole);
    const newRefreshToken = signRefreshToken(payload.email, userRole);

    // rotate refresh token in DB
    await executeMySql(`UPDATE refresh_tokens SET token = ?, created_at = CURRENT_TIMESTAMP WHERE user_email = ?`, [newRefreshToken, payload.email]);

    const response = NextResponse.json({
      isApiHandled: true,
      isRequestSuccess: true,
      statusCode: 200,
      message: 'Success',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        role: userRole,
      },
      exception: [],
    });

    setAuthCookies(response, { email: payload.email, role: userRole }, newAccessToken, newRefreshToken);

    return response;
  } catch (error) {
    console.error("[Auth Refresh] Unexpected error:", error);
    return NextResponse.json(
      {
        isApiHandled: false,
        isRequestSuccess: false,
        statusCode: 500,
        message: "Unknown error",
        data: null,
        exception: [],
      },
      { status: 500 }
    );
  }
}
