import { SignJWT, jwtVerify } from "jose";
import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} from "@/lib/auth/jwtSecretEncoder";
import {ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, JWT_SIGNING_ALGORITHM} from "@/constants/authConstants"
import type {TypeTokenPayload, TypeBaseTokenPayload} from "@/types/auth/tokenAndUserSession"
import type { userRole } from "@/types/userRole"

export function createAccessTokenPayload(email: string, role: userRole): TypeBaseTokenPayload{
    return {email, role, type: "access"}
}

export function createRefreshTokenPayload(email: string, role: userRole): TypeBaseTokenPayload{
    return {email, role, type: "refresh"}
}


export async function signAccessToken(payload: TypeBaseTokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_SIGNING_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_ACCESS_SECRET);
}

export async function signRefreshToken(payload: TypeBaseTokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_SIGNING_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_REFRESH_SECRET);
}


export async function verifyAccessToken(
  token: string
): Promise<TypeTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      JWT_ACCESS_SECRET
    );

    if (payload.type !== "access" || !payload.email || !payload.role) {
    return null;
}

    return payload as TypeTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<TypeTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      JWT_REFRESH_SECRET
    );

    if (payload.type !== "refresh" || !payload.email || !payload.role) {
    return null;
}

    return payload as TypeTokenPayload;
  } catch {
    return null;
  }
}

