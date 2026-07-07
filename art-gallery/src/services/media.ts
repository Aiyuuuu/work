import { connectDb } from "@/lib/db/db";
import { Media } from "@/lib/db/models";
import { BLUR_HASH_CONSTANT } from "@/constants/imageConstants";
import type { IMedia, IPaginatedMedia } from "@/types/services";
import { mapMediaDocument } from "@/mappers/media";
import { PAGE_SIZE } from "@/constants/imageConstants";
import { blurHashToDataURL } from "@/utils/blurhash/blurhash";
import type { ServiceResponse } from "@/types/services";
import { errorResponse, successResponse } from "./_response";
import { MAX_REQUESTED_PAGES } from "@/constants/imageConstants";
import { isValidMongooseObjectId } from "@/utils/validation/checkValidity";

export async function getMediaByMediaId(
  mediaId: string,
): Promise<ServiceResponse<IMedia>> {
  if (!mediaId || !isValidMongooseObjectId(mediaId)) {
    return errorResponse("BAD_REQUEST");
  }

  try {
    await connectDb();

    const media = await Media.findById(mediaId).lean();

    if (!media) return errorResponse("MEDIA_NOT_FOUND");

    const mappedMedia = mapMediaDocument(media);

    return successResponse({
      ...mappedMedia,
      blurDataURL: !mappedMedia.hash
        ? BLUR_HASH_CONSTANT
        : blurHashToDataURL(
            mappedMedia.hash,
            mappedMedia.width,
            mappedMedia.height,
          ),
    });
  } catch (err) {
    console.error("Failed to get media by ID", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function getPaginatedMedia(
  startPage: number,
  pages: number,
): Promise<ServiceResponse<IPaginatedMedia>> {
  if (
    typeof startPage !== "number" ||
    typeof pages !== "number" ||
    !Number.isFinite(startPage) ||
    !Number.isFinite(pages) ||
    startPage < 1 ||
    pages < 1 ||
    pages > MAX_REQUESTED_PAGES
  ) {
    return errorResponse("BAD_REQUEST");
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
      Media.estimatedDocumentCount(),
    ]);

    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const pagesReturned = Math.ceil(items.length / PAGE_SIZE);

    // Find the next page number, if there is one
    const nextStartPage =
      safeStartPage + pagesReturned <= totalPages
        ? safeStartPage + pagesReturned
        : null;

    const mappedItems = items.map((item) => {
      const mappedItem = mapMediaDocument(item);
      return {
        ...mappedItem,
        blurDataURL: mappedItem.hash
          ? blurHashToDataURL(
              mappedItem.hash,
              mappedItem.width,
              mappedItem.height,
            )
          : BLUR_HASH_CONSTANT,
      };
    });

    return successResponse({
      items: mappedItems,
      startPage: safeStartPage,
      pagesRequested: safePages,
      pagesReturned,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
      hasMore: nextStartPage !== null,
      nextStartPage,
    });
  } catch (err) {
    console.error("Failed to get paginated media", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}
