import mongoose, { Model, Schema } from "mongoose";
import { IrefreshTokens } from "@/types/db/db";

const refreshTokensSchema = new Schema<IrefreshTokens>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        revoked: { type: Boolean, required: true },
        createdAt: { type: Date, required: true }
    }
)

export const refreshTokens: Model<IrefreshTokens> = mongoose.models.refreshTokens || mongoose.model<IrefreshTokens>("refreshTokens", refreshTokensSchema);