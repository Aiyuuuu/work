import { NextResponse } from "next/server";
import { executeMySql } from "@/utils/db/client";
import { clearAuthCookies, parseCookies, REFRESH_COOKIE_NAME, verifyRefreshToken } from "@/utils/auth/auth";

export async function POST(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie") ?? "");
  const refreshToken = cookies[REFRESH_COOKIE_NAME];

  if (refreshToken) {
    const refreshPayload = verifyRefreshToken(refreshToken);
    if (refreshPayload?.email) {
      await executeMySql(`DELETE FROM refresh_tokens WHERE user_email = ?`, [refreshPayload.email]);
    }
  }

  const response = NextResponse.redirect(new URL("/auth", request.url));

  clearAuthCookies(response);

  return response;
}
