import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "@/types/db";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, required: true },
});

//use existing User model or create a new one if absent
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
