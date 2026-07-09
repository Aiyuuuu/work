import { SignJWT, jwtVerify } from "jose";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} from "@/lib/auth/jwtSecretEncoder";
import {
  ACCESS_TOKEN_EXPIRY,
  JWT_SIGNING_ALGORITHM,
  REFRESH_TOKEN_EXPIRY
} from "@/constants/authConstants";

import type {
  IAccessTokenPayload,
  IRefreshTokenPayload,
  IDecodedAccessTokenPayload,
  IDecodedRefreshTokenPayload,
} from "@/types/lib"; 

import { //importing type check functions from types file
  isDecodedAccessTokenPayload,
  isDecodedRefreshTokenPayload
} from "@/types/lib"

import type { UserRole } from "@/types/db";

export function createAccessTokenPayload(
  sub: string,
  role: UserRole,
): IAccessTokenPayload {
  return {
    sub,
    role,
    type: "access",
  };
}

export function createRefreshTokenPayload(
  sub: string,
): IRefreshTokenPayload {
  return {
    sub,
    type: "refresh",
  };
}

export async function signAccessToken(
  payload: IAccessTokenPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_SIGNING_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_ACCESS_SECRET);
}
 
export async function signRefreshToken(
  payload: IRefreshTokenPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_SIGNING_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_REFRESH_SECRET);
}


export async function verifyAccessToken(
  token: string,
): Promise<IDecodedAccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET);

    if (!isDecodedAccessTokenPayload(payload)) {
      return null;
    }
 
    return payload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<IDecodedRefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);


    const valid = isDecodedRefreshTokenPayload(payload);

    if (!valid) {
      return null;1
    }

    return payload;
  } catch {
    return null;
  }
}