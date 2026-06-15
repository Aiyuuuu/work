"use server"
import {connectDb} from "@/lib/db/db";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import { RefreshToken } from "@/lib/db/models";

export async function storeRefreshToken(
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date,
): Promise<Types.ObjectId> {
    await connectDb(); 
    
    const document = await RefreshToken.create({
        userId, 
        tokenHash,
        expiresAt,
        revoked: false,
        createdAt: new Date()
    })
    return document._id;
}

export async function verifyRefreshToken(
    userId: Types.ObjectId,
    refreshToken: string
): Promise<boolean>{
    await connectDb();
    const docs = await RefreshToken.find({
        userId,
        revoked: false,
        expiresAt: { $gt: new Date() }
    }).select("tokenHash").lean();

    if (!docs || docs.length === 0) return false;

    for (const doc of docs) {
        // doc.tokenHash is the stored bcrypt hash
        // compare supplied refreshToken (plain) with stored hash
        const ok = await bcrypt.compare(refreshToken, doc.tokenHash);
        if (ok) return true;
    }
    return false;
}


export async function revokeRefreshToken(
  id: Types.ObjectId
): Promise<void> {
  await connectDb();

  await RefreshToken.updateOne(
    { _id: id },
    {
      revoked: true,
    }
  );
}


export async function revokeAllRefreshTokens(
  userId: Types.ObjectId
): Promise<void> {
  await connectDb();

  await RefreshToken.updateMany(
    {
      userId,
      revoked: false,
    },
    {
      revoked: true,
    }
  );
}

