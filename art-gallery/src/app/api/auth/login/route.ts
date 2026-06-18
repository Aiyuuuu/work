import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getAuthErrorResponse } from "@/lib/errors/authErrors";
import { loginService } from "@/services/auth";
import type { LoginRequest } from "@/types/auth/requests";

// use services/auth/login
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as LoginRequest;
    const result = await loginService(body?.email, body?.password);

    //if login successful
    const response = NextResponse.json({ user: result.user });
    setAuthCookies(
      response,
      { email: result.user.email, role: result.user.role },
      result.accessToken,
      result.refreshToken
    );

    return response;
  } catch (error) {
    const { status, body } = getAuthErrorResponse(error);
    return NextResponse.json(body, {status: 403});
  }
}
