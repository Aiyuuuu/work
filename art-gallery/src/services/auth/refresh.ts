import {
  createAccessTokenPayload,
  signAccessToken,
  verifyRefreshToken as verifyRefreshJwt,
} from "@/lib/auth/signOrVerifyTokens";
import { AuthError } from "@/lib/errors/authErrors";
import { verifyRefreshToken as verifyRefreshTokenInDb } from "@/lib/auth/tokenStore";
import { connectDb } from "@/lib/db/db";
import { User } from "@/lib/db/models";
import { IRefreshServiceReturnPayload } from "@/types/auth/tokenAndUserSession";

export async function refreshService(
  refreshToken: string
): Promise<IRefreshServiceReturnPayload> {
  if (!refreshToken) {
    throw new AuthError("MISSING_REFRESH_TOKEN", "Missing refresh token", 400);
  }

  const payload = await verifyRefreshJwt(refreshToken);
  if (!payload || !payload.email) {
    throw new AuthError("INVALID_REFRESH_TOKEN", "Invalid refresh token", 401);
  }

  await connectDb();
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AuthError("INVALID_REFRESH_TOKEN", "Invalid refresh token", 401);
  }

  const ok = await verifyRefreshTokenInDb(user._id, refreshToken);
  if (!ok) {
    throw new AuthError("INVALID_REFRESH_TOKEN", "Invalid refresh token", 401);
  }

  const accessPayload = createAccessTokenPayload(user.email, user.role);
  const accessToken = await signAccessToken(accessPayload);

  return {
    accessToken,
    refreshToken,
  };
}
