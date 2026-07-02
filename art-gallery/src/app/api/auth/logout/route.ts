import { NextRequest, NextResponse } from "next/server";

import {
  clearAuthCookiesOnResponse,
  getAccessTokenFromRequest,
} from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";

import { logoutService } from "@/services/auth";
import type { LogoutRequest } from "@/types/requests";

import { handleApiError } from "@/errors/api/handleErrors";
import { AuthError } from "@/errors/services/authErrors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      throw new AuthError("ACCESS_TOKEN_INVALID");
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      throw new AuthError("ACCESS_TOKEN_INVALID");
    }

    let refreshTokenId: string | undefined;

    try {
      const body = (await request.json()) as LogoutRequest;
      refreshTokenId = body?.refreshTokenId;
    } catch {
      // No request body. Logout all devices.
    }

    await logoutService(payload.sub, refreshTokenId);

    const response = new NextResponse(null, {
      status: 204,
    });

    clearAuthCookiesOnResponse(response);

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}