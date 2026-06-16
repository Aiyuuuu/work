// services/image/getImageById.ts
import { connectDb } from "@/lib/db/db";
import { Image } from "@/lib/db/models";
import { blurHashToDataURL } from "@/utils/blurhash/blurhash";

export type SingleImage = {
  _id: string;
  externalId: number;
  url: string;
  hash: string;
  blurDataUrl: string;
  baseModel: string;
  browsingLevel: number;
  width: number;
  height: number;
};

export async function getImageById(id: string): Promise<SingleImage | null> {
  await connectDb();

  const image = await Image.findById(id).lean();

  if (!image) return null;

  return {
    _id: image._id.toString(),
    externalId: image.externalId,
    url: image.url,
    hash: image.hash,
    blurDataUrl: image.hash ? blurHashToDataURL(image.hash) : "",
    baseModel: image.baseModel,
    browsingLevel: image.browsingLevel,
    width: image.width,
    height: image.height,
  };
}