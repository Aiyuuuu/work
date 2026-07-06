import { connectDb } from "@/lib/db/db";
import { Media } from "@/lib/db/models";
import type { IMedia, PaginatedMediaResult } from "@/types/services";
import { mapMediaDocument } from "@/mappers/media";
import { PAGE_SIZE } from "@/constants/imageConstants";
import { MediaError } from "@/errors/services/mediaError";
import { blurHashToDataURL } from "@/utils/blurhash/blurhash";

export async function getMediaByMediaId(
  mediaId: string,
): Promise<IMedia | null> {
  if (!mediaId) {
    throw new MediaError("BAD_REQUEST");
  }

  try {
    await connectDb();

    const image = await Media.findById(mediaId).lean();

    if (!image) return null;

    const mappedImage = mapMediaDocument(image);

    return {
      ...mappedImage,
      blurDataURL: blurHashToDataURL(
        mappedImage.hash,
        mappedImage.width,
        mappedImage.height,
      ),
    };
  } catch (err) {
    if (err instanceof MediaError) {
      throw err;
    }

    console.error("Failed to get media by ID", err);
    throw new MediaError("INTERNAL_SERVER_ERROR");
  }
}

export async function getPaginatedMedia(
  startPage: number,
  pages: number,
): Promise<PaginatedMediaResult> {
  if (
    !Number.isInteger(startPage) ||
    !Number.isInteger(pages) ||
    startPage < 1 ||
    pages < 1
  ) {
    throw new MediaError("BAD_REQUEST");
  }

  try {
    await connectDb();

    // Keep page values safe
    const safeStartPage = Math.max(1, Math.floor(startPage));
    const safePages = Math.max(1, Math.floor(pages));

    // Convert page values into Mongo skip/limit values
    const skip = (safeStartPage - 1) * PAGE_SIZE;
    const limit = safePages * PAGE_SIZE;

    const [items, totalItems] = await Promise.all([
      Media.find({})
        // Stable sort so pagination does not jump around
        .sort({ createdAt: -1, _id: -1 }) //sort based on _id.
        .skip(skip)
        .limit(limit)
        .lean(),
      Media.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const pagesReturned = Math.ceil(items.length / PAGE_SIZE);

    // Find the next page number, if there is one
    const nextStartPage =
      safeStartPage + pagesReturned <= totalPages
        ? safeStartPage + pagesReturned
        : null;

    const mappedPaginatedMedia = {
      items: items.map(mapMediaDocument),
      startPage: safeStartPage,
      pagesRequested: safePages,
      pagesReturned,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
      hasMore: nextStartPage !== null,
      nextStartPage,
    };

    return {
      ...mappedPaginatedMedia,
      items: mappedPaginatedMedia.items.map((item) => ({
        ...item,
        blurDataURL: blurHashToDataURL(item.hash, item.width, item.height),
      })),
    };

  } catch (err) {
    if (err instanceof MediaError) {
      throw err;
    }

    console.error("Failed to get paginated media", err);
    throw new MediaError("INTERNAL_SERVER_ERROR");
  }
}