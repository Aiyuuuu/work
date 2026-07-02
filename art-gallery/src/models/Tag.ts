import mongoose, { Model, Schema } from "mongoose";
import { ITag } from "@/types/db";

const tagSchema = new Schema<ITag>({
  externalId: { type: Number },
  name: { type: String, required: true, unique: true, trim: true },
});

//use existing Tag model or create a new one if absent
export const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", tagSchema);
