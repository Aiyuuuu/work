import { REFRESH_TOKEN_EXPIRY_MS } from "@/constants/authConstants";
import { comparePassword } from "@/lib/auth/hashOrVerifyPasswordOrToken";
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth/signOrVerifyTokens";
import { storeRefreshToken } from "@/lib/store/RefreshTokenStore";
import type { ILoginServiceReturnPayload } from "@/types/services";
import { AuthError } from "@/errors/services/authErrors";
import { findUserByEmail } from "@/lib/store/userStore";

export async function loginService(
  email: string,
  password: string,
): Promise<ILoginServiceReturnPayload> {
  if (!email || !password) {
    throw new AuthError("MISSING_CREDENTIALS");
  }
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      throw new AuthError("INVALID_CREDENTIALS");
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      throw new AuthError("INVALID_CREDENTIALS");
    }

    const accessPayload = createAccessTokenPayload(user.id, user.role);
    const refreshPayload = createRefreshTokenPayload(user.id);

    const accessToken = await signAccessToken(accessPayload);
    const refreshToken = await signRefreshToken(refreshPayload);

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    await storeRefreshToken(user.id, refreshToken, expiresAt);

    return {
      userObject: {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  } catch (err) {
    if (err instanceof AuthError) {
      throw err;
    }

    console.error("Failed to login", err);
    throw new AuthError("INTERNAL_SERVER_ERROR");
  }
}
