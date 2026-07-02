import mongoose, { Model, Schema } from "mongoose";
import { IApi } from "@/types/db";

const apiSchema = new Schema<IApi>({
  name: { type: String, required: true, unique: true, trim: true },
  baseUrl: { type: String, required: true, unique: true, trim: true },
});

//use existing Api model or create a new one if absent
export const Api: Model<IApi> =
  mongoose.models.Api || mongoose.model<IApi>("Api", apiSchema);
