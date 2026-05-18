import { NextRequest, NextResponse } from "next/server";
import {
  getRefreshTokenFromRequest,
  getUserObjectFromRequest,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { AuthError, getAuthErrorResponse } from "@/lib/errors/authErrors";
import { refreshService } from "@/services/auth";
import type { RefreshRequest } from "@/types/auth/requests";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let refreshToken = getRefreshTokenFromRequest(request);

    if (!refreshToken) {
      try {
        const body = (await request.json()) as RefreshRequest;
        refreshToken = body?.refreshToken;
      } catch {
        refreshToken = undefined;
      }
    }

    const userObject = getUserObjectFromRequest(request);
    if (!userObject) {
      throw new AuthError("INVALID_USER", "Missing user", 401);
    }

    const result = await refreshService(refreshToken ?? "");
    const response = NextResponse.json({ accessToken: result.accessToken });

    setAuthCookies(
      response,
      { email: userObject.email, role: userObject.role },
      result.accessToken,
      result.refreshToken
    );

    return response;
  } catch (error) {
    const { status, body } = getAuthErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
