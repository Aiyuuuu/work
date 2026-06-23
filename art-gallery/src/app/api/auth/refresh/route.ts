import { NextRequest, NextResponse } from "next/server";
import {
  getRefreshTokenFromRequest,
  getUserObjectFromRequest,
  setAuthCookiesOnResponse,
} from "@/lib/auth/cookies";
import { AuthError, getAuthErrorResponse } from "@/lib/errors/authErrors";
import { refreshService } from "@/services/auth";
import type { RefreshRequest } from "@/types/auth/requests";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Try to get refresh token from cookies first
    let refreshToken = getRefreshTokenFromRequest(request);

    // If not in cookies, try reading it from request body
    if (!refreshToken) {
      try {
        const body = (await request.json()) as RefreshRequest;
        refreshToken = body?.refreshToken;
      } catch {
        refreshToken = null;
      }
    }

    const userObject = getUserObjectFromRequest(request); // Get user info stored in cookies

    // If user is missing, stop request
    if (!userObject) {
      throw new AuthError("INVALID_USER", "Missing user", 401);
    }

    // Generate a new access token using refresh token
    const result = await refreshService(refreshToken ?? "");
    const response = NextResponse.json({ accessToken: result.accessToken }); // Send new access token back to client

     // Update cookies with new access + refresh tokens
    setAuthCookiesOnResponse(
      response,
      { email: userObject.email, role: userObject.role },
      result.accessToken,
      result.refreshToken
    );

    return response;
  } catch (error) {
    // Convert known errors into proper HTTP responses
    const { status, body } = getAuthErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
