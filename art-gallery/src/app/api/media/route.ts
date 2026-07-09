import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import { getPaginatedMedia } from "@/services/media";
import {
  errorResponse,
  GETSuccessResponse,
} from "../_response";
import {
  getSuccessResponseData as getServiceSuccessResponseData,
  getErrorResponseErrorCode as getServiceErrorResponseErrorCode,
} from "@/services/_response";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startPageRaw = searchParams.get("startPage");
    const pagesRaw = searchParams.get("pages");
    if (!startPageRaw || !pagesRaw) {
      return NextResponse.json(...errorResponse("BAD_REQUEST"));
    }

    const startPage = Number(startPageRaw);
    const pages = Number(pagesRaw);

    if (Number.isNaN(startPage) || Number.isNaN(pages)) {
      return NextResponse.json(...errorResponse("BAD_REQUEST"));
    }

    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      return NextResponse.json(...errorResponse("ACCESS_TOKEN_MISSING"));
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(...errorResponse("ACCESS_TOKEN_INVALID"));
    }

    const getPaginatedMediaServiceResult = await getPaginatedMedia(
      startPage,
      pages,
    );

    if (!getPaginatedMediaServiceResult.success) {
      return NextResponse.json(
        ...errorResponse(
          getServiceErrorResponseErrorCode(getPaginatedMediaServiceResult),
        ),
      );
    }

    const getPaginatedMediaServiceResultData = getServiceSuccessResponseData(
      getPaginatedMediaServiceResult,
    );

    return NextResponse.json(
      ...GETSuccessResponse(getPaginatedMediaServiceResultData),
    );
  } catch (err) {
    console.error("Failed to get media", err);
    return NextResponse.json(...errorResponse("INTERNAL_SERVER_ERROR"));
  }
}
