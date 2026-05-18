import mongoose, {Model, Schema} from "mongoose";
import { ITag } from "@/types/db/db";

const tagSchema = new Schema<ITag>(
    {
    name: {type: String, required: true, unique: true}
    }
)

export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>("Tag", tagSchema);