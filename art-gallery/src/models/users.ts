import mongoose, {Model, Schema} from "mongoose";
import { Iusers } from "@/types/db/db";

const usersSchema = new Schema<Iusers>(
    {
    username: {type: String, required:true },
    email: {type: String, required:true, unique: true},
    passwordHash: {type: String, required:true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    createdAt: {type: Date, required: true}
    }
)

export const users: Model<Iusers> = mongoose.models.users || mongoose.model<Iusers>("users", usersSchema);