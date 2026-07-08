import { NextRequest, NextResponse } from "next/server";
import {
  getRefreshTokenFromRequest,
  setAuthCookiesOnResponse,
} from "@/lib/auth/cookies";
import { refreshService } from "@/services/auth";
import {
  POSTSuccessResponse,
  errorResponse,
  getServiceSuccessResponseData,
  getServiceErrorResponseErrorCode,
} from "../../_response";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = getRefreshTokenFromRequest(request);

    if(!refreshToken){
      return NextResponse.json(...errorResponse("REFRESH_TOKEN_MISSING"))
    }

    const refreshServiceResult = await refreshService(refreshToken);

    if(!refreshServiceResult.success){
      return NextResponse.json(...errorResponse(getServiceErrorResponseErrorCode(refreshServiceResult)))
    }

    const refreshServiceResultData = getServiceSuccessResponseData(refreshServiceResult);
  
    const response = NextResponse.json(...POSTSuccessResponse(null))
    setAuthCookiesOnResponse(
      response,
      refreshServiceResultData.accessToken,
      refreshServiceResultData.refreshToken,
    );

    return response;
  } catch (err) {
    console.error("Failed to refresh token", err)
      return NextResponse.json(...errorResponse("INTERNAL_SERVER_ERROR"))
    
  }
}
