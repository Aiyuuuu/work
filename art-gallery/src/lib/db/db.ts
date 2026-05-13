import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define \"MONGODB_URI\" in environment variables");
}

export const connectDb = async (): Promise<typeof mongoose> => {
    if (mongoose.connection.readyState>=1){
        return mongoose
    }
    return mongoose.connect(MONGODB_URI as string)
}