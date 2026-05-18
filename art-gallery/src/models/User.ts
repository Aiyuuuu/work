import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "@/types/db/db";

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        createdAt: { type: Date, required: true }
    }
)

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema); 