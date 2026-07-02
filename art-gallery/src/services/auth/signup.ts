import { REFRESH_TOKEN_EXPIRY_MS } from "@/constants/authConstants";
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth/signOrVerifyTokens";
import { storeRefreshToken } from "@/lib/store/RefreshTokenStore";
import type { ISignupServiceReturnPayload } from "@/types/services";
import { AuthError } from "@/errors/services/authErrors";
import { createUser } from "@/lib/store/userStore";
import type { UserRole } from "@/types/db";
import { UserStoreError } from "@/errors/lib/userStoreErrors";

export async function signupService(
  username: string,
  email: string,
  password: string,
  role?: UserRole,
): Promise<ISignupServiceReturnPayload> {
  if (!username || !email || !password) {
    throw new AuthError("MISSING_CREDENTIALS");
  }
  try {
    const trimmedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const user = await createUser(
      trimmedUsername,
      normalizedEmail,
      password,
      role,
    );

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
    if (err instanceof UserStoreError) {
      if (err.code === "USER_ALREADY_EXISTS") {
        throw new AuthError("USER_ALREADY_EXISTS");
      }

      throw new AuthError("INTERNAL_SERVER_ERROR");
    }
    console.error("Failed to signup", err);
    throw new AuthError("INTERNAL_SERVER_ERROR");
  }
}
