import { NextRequest, NextResponse } from "next/server";

import { getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";

import { getMediaByMediaId } from "@/services/media/mediaService";

import { AuthError } from "@/errors/services/authErrors";
import { handleApiError } from "@/errors/api/handleErrors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
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

    const { mediaId } = await params;

    const media = await getMediaByMediaId(mediaId);

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