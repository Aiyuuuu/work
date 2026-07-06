import { connectDb } from "@/lib/db/db";
import type { ActiveRefreshTokenVerificationResult } from "@/types/lib";
import { RefreshToken } from "@/lib/db/models";
import {
  hashToken,
  compareToken,
} from "@/lib/auth/hashOrVerifyPasswordOrToken";

export async function storeRefreshToken(
  userId: string,
  token: string,
  expiresAt: Date,
): Promise<void> {
  try {
    await connectDb();

    await RefreshToken.create({
      userId,
      tokenHash: await hashToken(token),
      expiresAt,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Failed to store refresh token in database", err);
    throw err;
  }
}

export async function verifyActiveRefreshToken(
  userId: string,
  refreshToken: string,
): Promise<ActiveRefreshTokenVerificationResult> {
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
    console.log("Found refresh tokens:", docs.length);

    if (docs.length === 0) return { valid: false };

    for (const doc of docs) {
      // Multiple active refresh tokens may exist (e.g. one per device),
      // so compare the supplied token against each stored hash. Return valid even if one matched
      const ok = await compareToken(refreshToken, doc.tokenHash);
      console.log({
        refreshTokenId: doc._id.toString(),
        matched: ok,
      });
      if (ok) return { valid: true, refreshTokenId: doc._id.toString() };
    }
    return { valid: false };
  } catch (err) {
    console.error("Failed to verify refresh token", err);
    throw err;
  }
}

export async function revokeRefreshToken(
  refreshTokenId: string,
): Promise<void> {
  try {
    await connectDb();

    await RefreshToken.updateOne(
      { _id: refreshTokenId },
      {
        revoked: true,
      },
    );
  } catch (err) {
    console.error("Failed to revoke refresh token", err);
    throw err;
  }
}

export async function revokeAllRefreshTokens(userId: string): Promise<void> {
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
  } catch (err) {
    console.error("Failed to revoke all refresh tokens", err);
    throw err;
  }
}
