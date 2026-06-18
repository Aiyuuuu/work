import mongoose, { Model, Schema } from "mongoose";
import type { IImage } from "@/types/db/db";
import type { IStats } from "@/types/db/db";

const imageSchema = new Schema<IImage>(
    {
        externalId: { type: Number, required: true, unique: true },
        url: { type: String, required: true, unique: true },
        hash: { type: String, required: true },
        baseModel: { type: String, required: true },
        browsingLevel: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        type: {type: String, required: true},
        createdAt: {type: Date || null, default: null},
        username: {type: String, required: true},
        stats: {type: Object || null},
        meta: {type: Object || null}
    }
)

export const Image: Model<IImage> = mongoose.models.Image || mongoose.model<IImage>("Image", imageSchema);