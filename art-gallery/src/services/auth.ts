import { comparePassword } from "@/lib/auth/hashOrVerifyPasswordOrToken";
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken as verifyRefreshTokenJWT,
} from "@/lib/auth/signOrVerifyTokens";
import { findUserByEmail, findUserById, createUser } from "@/services/user";
import type {
  ISignupServiceReturnPayload,
  IRefreshServiceReturnPayload,
  ILoginServiceReturnPayload,
  ServiceResponse,
} from "@/types/services";
import type { UserRole } from "@/types/db";
import {
  verifyActiveRefreshToken as verifyRefreshTokenDB,
  storeRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "@/services/refreshToken";
import {
  successResponse,
  errorResponse,
  isInternalServerError,
  getSuccessResponseData,
} from "./_response";

async function loginService(
  email: string,
  password: string,
): Promise<ServiceResponse<ILoginServiceReturnPayload>> {
  if (!email || !password) {
    return errorResponse("MISSING_CREDENTIALS");
  }
  try {
    const findUserByEmailServiceResult = await findUserByEmail(email);

    if (!findUserByEmailServiceResult.success) {
      // return internal server error as is
      if (isInternalServerError(findUserByEmailServiceResult)) {
        return errorResponse("INTERNAL_SERVER_ERROR");
      }
      /* ERROR MAPPING (Security): If user doesn't exist, map USER_NOT_FOUND to INVALID_CREDENTIALS 
    to prevent user enumeration attacks. */
      return errorResponse("INVALID_CREDENTIALS");
    }

    const user = getSuccessResponseData(findUserByEmailServiceResult);

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return errorResponse("INVALID_CREDENTIALS");
    }

    const accessPayload = createAccessTokenPayload(user.id, user.role);
    const refreshPayload = createRefreshTokenPayload(user.id);

    const accessToken = await signAccessToken(accessPayload);
    const refreshToken = await signRefreshToken(refreshPayload);

    const storeRefreshTokenServiceResult = await storeRefreshToken(
      user.id,
      refreshToken,
    );

    if (!storeRefreshTokenServiceResult.success) {
      return storeRefreshTokenServiceResult
    }

    return successResponse({
      userObject: {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Failed to login", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

async function signupService(
  username: string,
  email: string,
  password: string,
  role?: UserRole,
): Promise<ServiceResponse<ISignupServiceReturnPayload>> {
  if (!username || !email || !password) {
    return errorResponse("MISSING_CREDENTIALS");
  }
  try {
    const createUserServiceResult = await createUser(
      username,
      email,
      password,
      role,
    );

    if (!createUserServiceResult.success) {
      // return internal server error as is
      if (isInternalServerError(createUserServiceResult)) {
        return errorResponse("INTERNAL_SERVER_ERROR");
      }
      // ERROR BUBBLING: If creation failed for ANY reason, return the error payload directly.
      // we don't need error mapping for security here
      return createUserServiceResult;
    }

    const user = getSuccessResponseData(createUserServiceResult);

    const accessPayload = createAccessTokenPayload(user.id, user.role);
    const refreshPayload = createRefreshTokenPayload(user.id);

    const accessToken = await signAccessToken(accessPayload);
    const refreshToken = await signRefreshToken(refreshPayload);

    const storeRefreshTokenServiceResult = await storeRefreshToken(user.id, refreshToken);

    if(!storeRefreshTokenServiceResult.success){
      return storeRefreshTokenServiceResult;
    }

    return successResponse({
      userObject: {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Failed to signUp", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
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
): Promise<ServiceResponse<IRefreshServiceReturnPayload>> {
  if (!refreshToken) {
    //validate refresh token existence on request
    return errorResponse("REFRESH_TOKEN_MISSING");
  }

  try {
    // cryptographically verify the refresh token
    const payloadJWT = await verifyRefreshTokenJWT(refreshToken);
    if (!payloadJWT) {
      return errorResponse("REFRESH_TOKEN_INVALID");
    }

    // verify that the refresh token is present in the database and neither revoked nor expired
    const verifyRefreshTokenDBServiceResult = await verifyRefreshTokenDB(payloadJWT.sub, refreshToken);

    if(!verifyRefreshTokenDBServiceResult.success){
      return verifyRefreshTokenDBServiceResult;
    }

    const verifyRefreshTokenDBServiceResultData = getSuccessResponseData(verifyRefreshTokenDBServiceResult)

    // revoke refresh token in db
    const revokeRefreshTokenServiceResult = await revokeRefreshToken(verifyRefreshTokenDBServiceResultData.refreshTokenId);

    if(!revokeRefreshTokenServiceResult.success){
      return revokeRefreshTokenServiceResult;
    }

    // verify and extract the user from db who owns the refresh token
    const findUserByIdServiceResult = await findUserById(payloadJWT.sub);

    if (!findUserByIdServiceResult.success) {
      // return internal server errors as is
      if (isInternalServerError(findUserByIdServiceResult)) {
        return errorResponse("INTERNAL_SERVER_ERROR");
      }
      /* ERROR MAPPING (Security): If user doesn't exist, map USER_NOT_FOUND to UNAUTHORIZED 
    to prevent user enumeration attacks. */
      return errorResponse("UNAUTHORIZED");
    }

    const user = getSuccessResponseData(findUserByIdServiceResult);

    // sign(create) new access and refresh tokens (new refresh token due to "token rotation")
    const accessPayload = createAccessTokenPayload(user.id, user.role);
    const refreshPayload = createRefreshTokenPayload(user.id);

    const accessToken = await signAccessToken(accessPayload);
    const newRefreshToken = await signRefreshToken(refreshPayload);

    // store new refresh token in db
    const storeRefreshTokenServiceResult = await storeRefreshToken(user.id, newRefreshToken);

    if(!storeRefreshTokenServiceResult.success){
      return storeRefreshTokenServiceResult;
    }
    // return new access and refresh tokens
    return successResponse({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Failed to refresh token", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

async function logoutService(
  userId: string,
  refreshTokenId?: string,
): Promise<ServiceResponse<null>> {
  if (!userId) {
    return errorResponse("UNAUTHORIZED");
  }

  try {
    if (refreshTokenId) {
      const revokeRefreshTokenServiceResult = await revokeRefreshToken(refreshTokenId);
      if(!revokeRefreshTokenServiceResult.success){
        return revokeRefreshTokenServiceResult;
      }
    } else {
      const revokeRefreshTokenServiceResult = await revokeAllRefreshTokens(userId);
      if(!revokeRefreshTokenServiceResult.success){
       return revokeRefreshTokenServiceResult;
      }
    }
    return successResponse(null);
  } catch (err) {
    console.error("Failed to logout", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export { loginService, signupService, refreshService, logoutService };
