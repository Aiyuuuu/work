import type { UserRole } from "@/types/db";
import type { JWTPayload } from "jose";
import { isUserRole } from "@/types/db";

export interface IRefreshTokenPayload extends JWTPayload {
  //used by signOrVerifyToken.
  sub: string;
  type: "refresh";
}

export interface IAccessTokenPayload extends JWTPayload {
  //used by signOrVerifyToken.
  sub: string;
  role: UserRole;
  type: "access";
}

// jose adds iat and exp after decoding.  //used by signOrVerifyToken.
export interface IDecodedRefreshTokenPayload extends IRefreshTokenPayload {
  iat: number; // unix timestamp (number)
  exp: number; // unix timestamp (number)
}

// jose adds iat and exp after decoding. //used by signOrVerifyToken.
export interface IDecodedAccessTokenPayload extends IAccessTokenPayload {
  iat: number; // unix timestamp (number)
  exp: number; // unix timestamp (number)
}

// executable function to check the access token type on runtime. //used by signOrVerifyToken.
export function isAccessTokenPayload(
  payload: unknown,
): payload is IDecodedAccessTokenPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return typeof p.sub === "string" && p.type === "access" && isUserRole(p.role);
}

// executable function to check the refresh token type on runtime. //used by signOrVerifyToken.
export function isRefreshTokenPayload(
  payload: unknown,
): payload is IDecodedRefreshTokenPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return typeof p.sub === "string" && p.type === "refresh";
}

// executable function to check the access token type on runtime. //used by signOrVerifyToken.
export function isDecodedAccessTokenPayload(
  payload: unknown,
): payload is IDecodedAccessTokenPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return (
    typeof p.sub === "string" &&
    p.type === "access" &&
    isUserRole(p.role) &&
    typeof p.iat === "number" &&
    typeof p.exp === "number"
  );
}

// executable function to check the refresh token type on runtime. //used by signOrVerifyToken.
export function isDecodedRefreshTokenPayload(
  payload: unknown,
): payload is IDecodedRefreshTokenPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return (
    typeof p.sub === "string" &&
    p.type === "refresh" &&
    typeof p.iat === "number" &&
    typeof p.exp === "number"
  );
}

export interface ActiveRefreshTokenVerificationResult 
    {
      refreshTokenId: string;
    }
 


  