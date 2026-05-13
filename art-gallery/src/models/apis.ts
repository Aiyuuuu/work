import mongoose, {Model, Schema} from "mongoose";
import { Iapis } from "@/types/db/db";

const apisSchema = new Schema<Iapis>(
    {
    name: {type: String, required: true, unique: true},
    baseUrl: {type: String, required: true, unique: true},
    }
)

export const apis: Model<Iapis> = mongoose.models.apis || mongoose.model<Iapis>("apis", apisSchema);