import mongoose, { Model, Schema } from "mongoose";
import { IRefreshToken } from "@/types/db/db";

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        revoked: { type: Boolean, default: false },
        createdAt: { type: Date, required: true }
    }
)

export const RefreshToken: Model<IRefreshToken> =
 mongoose.models.RefreshToken || mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);