import { NextRequest, NextResponse } from "next/server";
import { setAuthCookiesOnResponse } from "@/lib/auth/cookies";
import { loginService } from "@/services/auth";
import type { LoginRequest } from "@/types/requests";
import { handleApiError } from "@/errors/api/handleErrors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as LoginRequest;

    const result = await loginService(body.email, body.password);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: result.userObject,
        },
      },
      {
        status: 200,
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