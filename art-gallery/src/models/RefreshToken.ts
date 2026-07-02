import mongoose, { Model, Schema } from "mongoose";
import { IRefreshToken } from "@/types/db";

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, required: true },
});

refreshTokenSchema.index({
    userId: 1,
    revoked: 1,
    expiresAt: 1,
});

refreshTokenSchema.index(
    { expiresAt: 1 },
    {
        expireAfterSeconds: 0,
    }
);

//use existing RefreshToken model or create a new one if absent
export const RefreshToken: Model<IRefreshToken> =
  mongoose.models.RefreshToken ||
  mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);
