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
    // Find the user using the email from the access token
    const user = await User.findOne({ email: payload.email });

    if (!user) { //if user isn't found in db
      throw new AuthError("INVALID_USER", "Invalid user", 401);
    }

    // Optional refresh token id (used for logging out one device)
    let refreshTokenId: Types.ObjectId | undefined;
    try {
      const body = (await request.json()) as LogoutRequest; // Read the request body

      // Convert refreshTokenId string to MongoDB ObjectId
      if (body?.refreshTokenId) {
        refreshTokenId = new Types.ObjectId(body.refreshTokenId);
      }
    } catch {
      // No body provided, logout service will handle it
      refreshTokenId = undefined;
    }

    // If refreshTokenId exists, logout one device
    // Otherwise, logout all devices
    await logoutService(user._id, refreshTokenId); //use logout service

    const response = NextResponse.json({ success: true }); // Create a success response
    clearAuthCookies(response); // Remove auth cookies from the browser
    return response;
  } catch (error) {
    // Convert the error into a proper API response
    const { status, body } = getAuthErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
