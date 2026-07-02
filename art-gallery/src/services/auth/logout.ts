import {
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "@/lib/store/RefreshTokenStore";
import { AuthError } from "@/errors/services/authErrors";

export async function logoutService(
  userId: string,
  refreshTokenId?: string,
): Promise<void> {
  if (!userId) {
    throw new AuthError("UNAUTHORIZED");
  }

  try {
    if (refreshTokenId) {
      await revokeRefreshToken(refreshTokenId);
    } else {
      await revokeAllRefreshTokens(userId);
    }
  } catch (err) {
    console.error("Failed to logout", err);
    throw new AuthError("INTERNAL_SERVER_ERROR");
  }
}
