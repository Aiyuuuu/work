import { blurHashToDataURL } from "@/utils/blurhash/blurhash";
import { HomeImagesResult } from "@/types/services/home";
import { SingleImage } from "@/types/services/home";
import { getImages as getImagesLib } from "@/lib/images/getImages";
import type { IImage } from "@/types/db/db";

function toPlain<T>(obj: T): T {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

export async function getImages(
  startPage = 1,
  pages = 1,
): Promise<HomeImagesResult> {
  const { items: rawImages, ...rest } = await getImagesLib(startPage, pages);
  // Convert Mongo documents into clean plain objects
  const items: SingleImage[] = rawImages.map((img: IImage) => ({
    _id: img._id.toString(),
    externalId: img.externalId,
    url: img.url,
    hash: img.hash,
    blurDataUrl: img.hash ? blurHashToDataURL(img.hash) : "",
    baseModel: img.baseModel,
    browsingLevel: img.browsingLevel,
    width: img.width,
    height: img.height,
    type: img.type,
    createdAt: img.createdAt,
    username: img.username,
    stats: toPlain(img.stats),
    meta: toPlain(img.meta),
  }));

  return {
    items,
    startPage: rest.startPage,
    pagesRequested: rest.pagesRequested,
    pagesReturned: rest.pagesReturned,
    pageSize: rest.pageSize,
    totalItems: rest.totalItems,
    totalPages: rest.totalPages,
    hasMore: rest.hasMore,
    nextStartPage: rest.nextStartPage,
  };
}
