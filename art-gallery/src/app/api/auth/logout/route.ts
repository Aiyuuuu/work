import { NextRequest, NextResponse } from "next/server";
import {
  clearAuthCookiesOnResponse,
  getAccessTokenFromRequest,
} from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import { logoutService } from "@/services/auth";
import { errorResponse, POSTSuccessResponse } from "../../_response";
import { getErrorResponseErrorCode } from "@/services/_response";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      return NextResponse.json(...errorResponse("ACCESS_TOKEN_MISSING"));
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(...errorResponse("ACCESS_TOKEN_INVALID"));
    }

    const logoutServiceResponse = await logoutService(payload.sub);

    if (!logoutServiceResponse.success) {
      return NextResponse.json(
        ...errorResponse(getErrorResponseErrorCode(logoutServiceResponse)),
      );
    }

    const response = NextResponse.json(...POSTSuccessResponse(null));

    clearAuthCookiesOnResponse(response);

    return response;
  } catch (err) {
    console.error("Failed to logout", err)
      return NextResponse.json(...errorResponse("INTERNAL_SERVER_ERROR"));
    
  }
}
