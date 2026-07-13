// src/mappers/media.ts

import type { IMedia as IMediaDb } from "@/types/db";
import type { IMedia } from "@/types/services";

/**
 * Maps a raw MongoDB media document into a plain JavaScript object.
 * Resolves 64-bit Long integers (seeds) into clean strings on the server.
 */
export function mapMediaDocument({
  _id,
  __v,
  ...media
}: IMediaDb): Omit<IMedia, "blurDataURL"> {
  const plainMedia = JSON.parse(JSON.stringify(media));

  // Server-Side 64-Bit Recovery
  if (plainMedia.meta && typeof plainMedia.meta.seed === "object") {
    try {
      const seedObj = plainMedia.meta.seed;
      const high = BigInt(seedObj.high);
      const low = BigInt(seedObj.low >= 0 ? seedObj.low : 4294967296 + seedObj.low);
      
      // 🟢 FIXED: Replace 4294967296n with BigInt(4294967296) to satisfy ES2017 target compilation
      plainMedia.meta.seed = ((high * BigInt(4294967296)) + low).toString();
    } catch {
      plainMedia.meta.seed = "—";
    }
  }

  return {
    id: _id.toString(),
    ...plainMedia,
  };
}