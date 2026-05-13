import mongoose, { Model, Schema } from "mongoose";
import { Iimages } from "@/types/db/db";

const imagesSchema = new Schema<Iimages>(
    {
        externalId: { type: Number, required: true, unique: true },
        url: { type: String, required: true, unique: true },
        hash: { type: String, required: true },
        baseModel: { type: String, required: true },
        browsingLevel: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    }
)

export const images: Model<Iimages> = mongoose.models.images || mongoose.model<Iimages>("images", imagesSchema);