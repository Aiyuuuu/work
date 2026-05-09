import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "RefreshToken";
export const USER_OBJECT_COOKIE_NAME = "user_object";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? "dev-access-secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "dev-refresh-secret";

export type UserRole = "user" | "admin";

type TokenPayload = {
  email: string;
  role: UserRole;
  type: "access" | "refresh";
};

function isUserRole(value: unknown): value is UserRole {
  return value === "user" || value === "admin";
}

export function signAccessToken(email: string, role: UserRole) {
  return jwt.sign({ email, role, type: "access" }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(email: string, role: UserRole) {
  return jwt.sign({ email, role, type: "refresh" }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (typeof decoded !== "object" || !decoded) {
      return null;
    }
    if (decoded.type !== "access" || typeof decoded.email !== "string" || !isUserRole(decoded.role)) {
      return null;
    }
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (typeof decoded !== "object" || !decoded) {
      return null;
    }
    if (decoded.type !== "refresh" || typeof decoded.email !== "string" || !isUserRole(decoded.role)) {
      return null;
    }
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

export function buildAuthValue(email: string, role: UserRole) {
  return signAccessToken(email, role);
}

export function isAuthValueValid(value: string) {
  return verifyAccessToken(value) !== null;
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const [key, ...rest] = part.split("=");
      if (!key || rest.length === 0) {
        return acc;
      }

      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});
}

export function extractAccessTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookies = parseCookies(request.headers.get("cookie") ?? "");
  return cookies[AUTH_COOKIE_NAME] ?? null;
}

export function getAuthUserFromRequest(request: Request): { email: string; role: UserRole } | null {
  const token = extractAccessTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return null;
  }

  return { email: payload.email, role: payload.role };
}

export function setAuthCookies(
  response: NextResponse,
  session: { email: string; role: UserRole },
  accessToken: string,
  refreshToken: string
) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set({
    name: USER_OBJECT_COOKIE_NAME,
    value: JSON.stringify({
      token: accessToken,
      refreshToken,
      email: session.email,
      role: session.role,
    }),
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set({ name: AUTH_COOKIE_NAME, value: "", httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set({ name: USER_OBJECT_COOKIE_NAME, value: "", sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set({ name: REFRESH_COOKIE_NAME, value: "", httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}
