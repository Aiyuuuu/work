import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  signRefreshToken,
  signAccessToken,
  verifyRefreshToken as verifyRefreshTokenJWT,
} from "@/lib/auth/signOrVerifyTokens";
import { AuthError } from "@/errors/services/authErrors";
import {
  verifyActiveRefreshToken as verifyRefreshTokenDB,
  storeRefreshToken,
  revokeRefreshToken,
} from "@/lib/store/RefreshTokenStore";
import { IRefreshServiceReturnPayload } from "@/types/services";
import { findUserById } from "@/lib/store/userStore";
import { REFRESH_TOKEN_EXPIRY_MS } from "@/constants/authConstants";

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

export async function refreshService(
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
