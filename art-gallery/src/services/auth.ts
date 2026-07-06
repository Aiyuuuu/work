import { REFRESH_TOKEN_EXPIRY_MS } from "@/constants/authConstants";
import { comparePassword } from "@/lib/auth/hashOrVerifyPasswordOrToken";
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken as verifyRefreshTokenJWT,
} from "@/lib/auth/signOrVerifyTokens";
import { AuthError } from "@/errors/services/authErrors";
import { findUserByEmail, findUserById } from "@/services/user";
import type {
  ISignupServiceReturnPayload,
  IRefreshServiceReturnPayload,
  ILoginServiceReturnPayload,
  ServiceResponse,
} from "@/types/services";
import { createUser } from "@/services/user";
import type { UserRole } from "@/types/db";
import { UserStoreError } from "@/errors/lib/userStoreErrors";
import {
  verifyActiveRefreshToken as verifyRefreshTokenDB,
  storeRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "@/services//refreshToken";

async function loginService(
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

async function signupService(
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

/* flow:
1) validate refresh token existence on request
2) Verify the JWT signature and expiration.
3) verify that the refresh token is present in the database and neither revoked nor expired
4) revoke refresh token in db
5) verify and extract the user from db who owns the refresh token
6) sign(create) new access and refresh tokens (new refresh token due to "token rotation")
7) store new refresh token in db
8) return new access and refresh tokens
*/

async function refreshService(
  refreshToken: string,
): Promise<IRefreshServiceReturnPayload> {
  if (!refreshToken) {
    //validate refresh token existence on request
    throw new AuthError("REFRESH_TOKEN_MISSING");
  }

  try {
    // cryptographically verify the refresh token
    const payloadJWT = await verifyRefreshTokenJWT(refreshToken);
    console.log("JWT payload:", payloadJWT);
    if (!payloadJWT) {
      throw new AuthError("REFRESH_TOKEN_INVALID");
    }

    // verify that the refresh token is present in the database and neither revoked nor expired
    const payloadDb = await verifyRefreshTokenDB(payloadJWT.sub, refreshToken);
    console.log("DB verification:", payloadDb);

    if (payloadDb.valid === false) {
      throw new AuthError("REFRESH_TOKEN_INVALID");
    }

    // revoke refresh token in db
    await revokeRefreshToken(payloadDb.refreshTokenId);

    // verify and extract the user from db who owns the refresh token
    const user = await findUserById(payloadJWT.sub);
    if (!user) {
      throw new AuthError("UNAUTHORIZED");
    }

    // sign(create) new access and refresh tokens (new refresh token due to "token rotation")
    const accessPayload = createAccessTokenPayload(user.id, user.role);
    const refreshPayload = createRefreshTokenPayload(user.id);

    const accessToken = await signAccessToken(accessPayload);
    const newRefreshToken = await signRefreshToken(refreshPayload);

    // store new refresh token in db
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
    await storeRefreshToken(user.id, newRefreshToken, expiresAt);

    // return new access and refresh tokens
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    if (err instanceof AuthError) {
      // catch AuthErrors thrown above
      throw err;
    }

    console.error("Failed to refresh token", err);
    throw new AuthError("INTERNAL_SERVER_ERROR");
  }
}

async function logoutService(
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

export { loginService, signupService, refreshService, logoutService };
