import { Types } from "mongoose";
import {
  revokeAllRefreshTokens,
  revokeRefreshToken,
} from "@/lib/auth/tokenStore";
import { AuthError } from "@/lib/errors/authErrors";
import { ILogoutServiceReturnPayload } from "@/types/auth/tokenAndUserSession";

export async function logoutService(
  userId: Types.ObjectId,
  refreshTokenId?: Types.ObjectId
): Promise<ILogoutServiceReturnPayload> {
  if (!userId) {
    throw new AuthError("MISSING_USER_ID", "Missing user id", 400);
  }

  if (refreshTokenId) {
    await revokeRefreshToken(refreshTokenId);
  } else {
    await revokeAllRefreshTokens(userId);
  }

  return { success: true };
}
