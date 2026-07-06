import { NextRequest, NextResponse } from "next/server";

import { getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";

import { getPaginatedMedia } from "@/services/media";

import { AuthError } from "@/errors/services/authErrors";
import { handleApiError } from "@/errors/api/handleErrors";

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      throw new AuthError("ACCESS_TOKEN_INVALID");
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      throw new AuthError("ACCESS_TOKEN_INVALID");
    }

    const searchParams = request.nextUrl.searchParams;

    const startPage = Number(searchParams.get("startPage") ?? 1);
    const pages = Number(searchParams.get("pages") ?? 1);

    const media = await getPaginatedMedia(startPage, pages);

    return NextResponse.json(
      {
        success: true,
        data: media,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    return handleApiError(err);
  }
}