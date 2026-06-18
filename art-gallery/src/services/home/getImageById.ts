// services/image/getImageById.ts
import { getImageById as getImageByIdLib } from "@/lib/images/getImageById";
import { blurHashToDataURL } from "@/utils/blurhash/blurhash";
import { SingleImage } from "@/types/services/home";


export async function getImageById(id: string): Promise<SingleImage | null> {
  const image = await getImageByIdLib(id);

  if (!image) return null;

  return {
    _id: image._id.toString(),
    externalId: image.externalId,
    url: image.url,
    hash: image.hash,
    blurDataUrl: image.hash && image.width ? blurHashToDataURL(image.hash) : "",
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

