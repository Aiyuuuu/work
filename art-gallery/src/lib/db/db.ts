import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define "MONGODB_URI" in environment variables');
}

//connect to database or return existing connection
export async function connectDb(): Promise<typeof mongoose> {
  if (
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    return mongoose;
  }
  return mongoose.connect(MONGODB_URI!); // ! = have already guaranteed MONGODB_URI isn't undefined so mute typescript error.
}
