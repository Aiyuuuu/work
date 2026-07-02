import mongoose, { Model, Schema } from "mongoose";
import type { IStats, IMeta, IMedia } from "@/types/db";

const statsSchema = new Schema<IStats>(
  {
    cryCount: { type: Number, required: true },
    laughCount: { type: Number, required: true },
    likeCount: { type: Number, required: true },
    dislikeCount: { type: Number, required: true },
    heartCount: { type: Number, required: true },
    commentCount: { type: Number, required: true },
  },
  { _id: false },
);

const metaSchema = new Schema<IMeta>(
  {
    prompt: { type: String },
    negativePrompt: { type: String },
    seed: { type: Number },
    sampler: { type: String },
    steps: { type: Number },
    cfgScale: { type: Number },
    clipSkip: { type: Number },
  },
  { _id: false },
);

const mediaSchema = new Schema<IMedia>({
  externalId: { type: Number, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  baseModel: { type: String, default: null },
  browsingLevel: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true },
  stats: { type: statsSchema, required: true },
  meta: { type: metaSchema, default: null },
});

//use existing Media model or create a new one if absent
export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);
