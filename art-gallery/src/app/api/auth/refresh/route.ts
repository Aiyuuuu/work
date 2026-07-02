import { NextRequest, NextResponse } from "next/server";

import {
  getRefreshTokenFromRequest,
  setTokenCookiesOnResponse,
} from "@/lib/auth/cookies";

import { refreshService } from "@/services/auth";
import type { RefreshRequest } from "@/types/requests";

import { handleApiError } from "@/errors/api/handleErrors";

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    // Prefer cookie, fall back to request body
    let refreshToken = getRefreshTokenFromRequest(request);
    console.log("Refresh token:", refreshToken);

    if (!refreshToken) {
      try {
        const body = (await request.json()) as RefreshRequest;
        refreshToken = body?.refreshToken;
      } catch {
        // Ignore if no JSON body
      }
    }

    const result = await refreshService(refreshToken ?? "");

    const response = NextResponse.json(
      {
        success: true,
        data: null,
      },
      {
        status: 200,
      },
    );

    setTokenCookiesOnResponse(
      response,
      result.accessToken,
      result.refreshToken,
    );

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}