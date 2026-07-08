import { NextRequest, NextResponse } from "next/server";
import { setAuthCookiesOnResponse } from "@/lib/auth/cookies";
import { loginService } from "@/services/auth";
import {
  getServiceSuccessResponseData,
  errorResponse,
  POSTSuccessResponse,
  getServiceErrorResponseErrorCode,
} from "../../_response";
import type { LoginRequest } from "@/types/requests";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as LoginRequest;

    const loginServiceResponse = await loginService(body.email, body.password);

    if (!loginServiceResponse.success) {
      return NextResponse.json(
        ...errorResponse(
          getServiceErrorResponseErrorCode(loginServiceResponse), //get the error code from the error response of the service
        ),
      );
    }

    const loginServiceResponseData =
      getServiceSuccessResponseData(loginServiceResponse);

    const response = NextResponse.json(...POSTSuccessResponse(null));

    setAuthCookiesOnResponse(
      response,
      loginServiceResponseData.accessToken,
      loginServiceResponseData.refreshToken,
    );

    return response;
  } catch (err) {
    console.error("Failed to login", err);
    return NextResponse.json(...errorResponse("INTERNAL_SERVER_ERROR"));
  }
}
