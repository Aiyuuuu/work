import mongoose, {Model, Schema} from "mongoose";
import { Itags } from "@/types/db/db";

const tagsSchema = new Schema<Itags>(
    {
    name: {type: String, required: true, unique: true}
    }
)

export const tags: Model<Itags> = mongoose.models.tags || mongoose.model<Itags>("tags", tagsSchema);