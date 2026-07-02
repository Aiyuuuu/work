import { NextRequest, NextResponse } from "next/server";

import { signupService } from "@/services/auth";
import { setAuthCookiesOnResponse } from "@/lib/auth/cookies";

import { handleApiError } from "@/errors/api/handleErrors";

import type { SignupRequest } from "@/types/requests";

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const body = (await request.json()) as SignupRequest;

    const result = await signupService(
      body.username,
      body.email,
      body.password,
    );

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: result.userObject,
        },
      },
      {
        status: 201,
      },
    );

    setAuthCookiesOnResponse(
      response,
      result.userObject,
      result.accessToken,
      result.refreshToken,
    );

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}