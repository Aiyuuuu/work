import { REFRESH_TOKEN_EXPIRY_MS } from "@/constants/authConstants";
import { connectDb } from "@/lib/db/db";
import type { ActiveRefreshTokenVerificationResult } from "@/types/lib";
import { RefreshToken } from "@/lib/db/models";
import {
  hashToken,
  compareToken,
} from "@/lib/auth/hashOrVerifyPasswordOrToken";
import { ServiceResponse } from "@/types/services";
import { errorResponse, successResponse } from "./_response";
import { mapRefreshTokenDocument } from "@/mappers/refreshToken";

export async function storeRefreshToken(
  userId: string,
  token: string,
): Promise<ServiceResponse<null>> {
  if (!userId || !token) {
    return errorResponse("BAD_REQUEST");
  }
  try {
    await connectDb();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    await RefreshToken.create({
      userId,
      tokenHash: await hashToken(token),
      expiresAt,
      createdAt: new Date(),
    });

    return successResponse(null);
  } catch (err) {
    console.error("Failed to store refresh token in database", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function verifyActiveRefreshToken(
  userId: string,
  refreshToken: string,
): Promise<ServiceResponse<ActiveRefreshTokenVerificationResult>> {
  if (!userId || !refreshToken) {
    return errorResponse("BAD_REQUEST");
  }
  try {
    await connectDb();
    const docs = await RefreshToken.find(
      {
        userId,
        revoked: false,
        expiresAt: { $gt: new Date() },
      },
      { tokenHash: 1, _id: 1 },
    ).lean();

    if (docs.length === 0) return errorResponse("REFRESH_TOKEN_INVALID");

    const mappedDocs = docs.map((doc) => mapRefreshTokenDocument(doc));

    for (const doc of mappedDocs) {
      // Multiple active refresh tokens may exist (e.g. one per device),
      // so compare the supplied token against each stored hash. Return valid if one matches
      const ok = await compareToken(refreshToken, doc.tokenHash);
      if (ok) return successResponse({ refreshTokenId: doc.id });
    }
    return errorResponse("REFRESH_TOKEN_INVALID");
  } catch (err) {
    console.error("Failed to verify refresh token", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function revokeRefreshToken(
  refreshTokenId: string,
): Promise<ServiceResponse<null>> {
  if (!refreshTokenId) {
    return errorResponse("BAD_REQUEST");
  }
  try {
    await connectDb();
    const result = await RefreshToken.updateOne(
      { _id: refreshTokenId },
      {
        revoked: true,
      },
    );

    if (result.matchedCount === 0) {
      return errorResponse("REFRESH_TOKEN_INVALID");
    }

    return successResponse(null);
  } catch (err) {
    console.error("Failed to revoke refresh token", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function revokeAllRefreshTokens(
  userId: string,
): Promise<ServiceResponse<null>> {
  if (!userId) {
    return errorResponse("BAD_REQUEST");
  }
  try {
    await connectDb();

    await RefreshToken.updateMany(
      {
        userId,
        revoked: false,
      },
      {
        revoked: true,
      },
    );

    return successResponse(null);
  } catch (err) {
    console.error("Failed to revoke all refresh tokens", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}
