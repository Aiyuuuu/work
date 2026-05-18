import mongoose, { Model, Schema } from "mongoose";
import { IApi } from "@/types/db/db";

const apiSchema = new Schema<IApi>(
    {
        name: { type: String, required: true, unique: true },
        baseUrl: { type: String, required: true, unique: true },
    }
)

export const Api: Model<IApi> = mongoose.models.Api || mongoose.model<IApi>("Api", apiSchema);