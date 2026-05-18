import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getAuthErrorResponse } from "@/lib/errors/authErrors";
import { signupService } from "@/services/auth";
import type { SignupRequest } from "@/types/auth/requests";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as SignupRequest;
    const result = await signupService(
      body?.username,
      body?.email,
      body?.password
    );

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
    return NextResponse.json(body, { status });
  }
}
