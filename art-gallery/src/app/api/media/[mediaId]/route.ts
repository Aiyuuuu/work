import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import { getMediaByMediaId } from "@/services/media";
import {
  errorResponse,
  GETSuccessResponse,
  getServiceErrorResponseErrorCode,
  getServiceSuccessResponseData,
} from "../../_response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
): Promise<NextResponse> {
  try {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      return NextResponse.json(...errorResponse("ACCESS_TOKEN_MISSING"));
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(...errorResponse("ACCESS_TOKEN_INVALID"));
    }

    const { mediaId } = await params;

    const getMediaByMediaIdServiceResult = await getMediaByMediaId(mediaId);

    if (!getMediaByMediaIdServiceResult.success) {
      return NextResponse.json(
        ...errorResponse(
          getServiceErrorResponseErrorCode(getMediaByMediaIdServiceResult),
        ),
      );
    }

    const getMediaByMediaIdServiceResultData = getServiceSuccessResponseData(getMediaByMediaIdServiceResult)

    return NextResponse.json(...GETSuccessResponse(getMediaByMediaIdServiceResultData))
  } catch (err) {
    console.error("Failed to get media by mediaId", err)
      return NextResponse.json(...errorResponse("INTERNAL_SERVER_ERROR"));
    
  }
}
