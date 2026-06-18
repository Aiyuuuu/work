import { connectDb } from "@/lib/db/db";
import { Image } from "@/lib/db/models";
import { blurHashToDataURL } from "@/utils/blurhash/blurhash";
import { PAGE_SIZE } from "@/constants/imageConstants";

export type HomeImage = {
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

export type HomeImagesResult = {
  items: HomeImage[];
  startPage: number;
  pagesRequested: number;
  pagesReturned: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  nextStartPage: number | null;
};

export async function getImages(
  startPage = 1,
  pages = 1
): Promise<HomeImagesResult> {
  await connectDb();

  // Keep page values safe
  const safeStartPage = Math.max(1, Math.floor(startPage));
  const safePages = Math.max(1, Math.floor(pages));

  // Convert page values into Mongo skip/limit values
  const skip = (safeStartPage - 1) * PAGE_SIZE;
  const limit = safePages * PAGE_SIZE;

  const [rawImages, totalItems] = await Promise.all([
    Image.find({})
      // Stable sort so pagination does not jump around
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Image.countDocuments({}),
  ]);

  // Convert Mongo documents into clean plain objects
  const items: HomeImage[] = rawImages.map((img: any) => ({
    _id: img._id.toString(),
    externalId: img.externalId,
    url: img.url,
    hash: img.hash,
    blurDataUrl: img.hash ? blurHashToDataURL(img.hash) : "",
    baseModel: img.baseModel,
    browsingLevel: img.browsingLevel,
    width: img.width,
    height: img.height,
  }));

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const pagesReturned = Math.ceil(items.length / PAGE_SIZE);

  // Find the next page number, if there is one
  const nextStartPage =
    safeStartPage + pagesReturned <= totalPages
      ? safeStartPage + pagesReturned
      : null;

  return {
    items,
    startPage: safeStartPage,
    pagesRequested: safePages,
    pagesReturned,
    pageSize: PAGE_SIZE,
    totalItems,
    totalPages,
    hasMore: nextStartPage !== null,
    nextStartPage,
  };
}