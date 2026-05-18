import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { clearAuthCookies, getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { AuthError, getAuthErrorResponse } from "@/lib/errors/authErrors";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import { logoutService } from "@/services/auth";
import { connectDb } from "@/lib/db/db";
import { User } from "@/lib/db/models";
import type { LogoutRequest } from "@/types/auth/requests";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = getAccessTokenFromRequest(request);
    if (!accessToken) {
      throw new AuthError("MISSING_ACCESS_TOKEN", "Missing access token", 401);
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.email) {
      throw new AuthError("INVALID_ACCESS_TOKEN", "Invalid access token", 401);
    }

    await connectDb();
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw new AuthError("INVALID_USER", "Invalid user", 401);
    }

    let refreshTokenId: Types.ObjectId | undefined;
    try {
      const body = (await request.json()) as LogoutRequest;
      if (body?.refreshTokenId) {
        refreshTokenId = new Types.ObjectId(body.refreshTokenId);
      }
    } catch {
      refreshTokenId = undefined;
    }

    await logoutService(user._id, refreshTokenId);

    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    const { status, body } = getAuthErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
