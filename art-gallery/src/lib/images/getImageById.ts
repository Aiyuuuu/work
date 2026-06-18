// services/image/getImageById.ts
import { connectDb } from "@/lib/db/db";
import { Image } from "@/lib/db/models";
import type { IImage } from "@/types/db/db";


export async function getImageById(id: string): Promise<IImage | null> {
  await connectDb();

  const image = await Image.findById(id).lean();

  if (!image) return null;

  return {
    _id: image._id,
    externalId: image.externalId,
    url: image.url,
    hash: image.hash,
    baseModel: image.baseModel,
    browsingLevel: image.browsingLevel,
    width: image.width,
    height: image.height,
    type: image.type,
    createdAt: image.createdAt,
    username: image.username,
    stats: image.stats,
    meta: image.meta,
  };
}