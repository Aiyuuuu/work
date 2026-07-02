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
  } catch (err) {
    console.error("Failed to verify access token:", err);
    return null;
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<IDecodedRefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);

    console.log("Verified payload:", payload);

    const valid = isDecodedRefreshTokenPayload(payload);
    console.log("Type guard:", valid);

    if (!valid) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Failed to verify refresh token:", err);
    return null;
  }
}