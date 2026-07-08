import { NextRequest, NextResponse } from "next/server";
import { signupService } from "@/services/auth";
import { setAuthCookiesOnResponse } from "@/lib/auth/cookies";
import type { SignupRequest } from "@/types/requests";
import {
  POSTSuccessResponse,
  errorResponse,
  getServiceErrorResponseErrorCode,
  getServiceSuccessResponseData,
} from "../../_response";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as SignupRequest;

    const signupServiceResponse = await signupService(
      body.username,
      body.email,
      body.password,
    );
    if (!signupServiceResponse.success) {
      return NextResponse.json(
        ...errorResponse(
          getServiceErrorResponseErrorCode(signupServiceResponse),
        ),
      );
    }

    const signupServiceResponseData = getServiceSuccessResponseData(
      signupServiceResponse,
    );

    const response = NextResponse.json(POSTSuccessResponse(null));
    setAuthCookiesOnResponse(
      response,
      signupServiceResponseData.accessToken,
      signupServiceResponseData.refreshToken,
    );

    return response;
  } catch (err) {
    console.log("Failed to signup", err);
    return NextResponse.json(...errorResponse("INTERNAL_SERVER_ERROR"));
  }
}
