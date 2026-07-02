import { IMedia, PaginatedMediaResult } from "@/types/services";
import {
  getMediaByMediaId as getMediaByMediaIdLib,
  getPaginatedMedia as getPaginatedMediaLib,
} from "@/lib/store/mediaStore";
import { MediaError } from "@/errors/services/mediaError";
import { blurHashToDataURL } from "@/utils/blurhash/blurhash";

export async function getMediaByMediaId(
  mediaId: string,
): Promise<IMedia | null> {
  if (!mediaId) {
    throw new MediaError("BAD_REQUEST");
  }

  try {
    const mediaItem = await getMediaByMediaIdLib(mediaId);

    if (!mediaItem) {
      return null;
    }

    return {
      ...mediaItem,
      blurDataURL: blurHashToDataURL(
        mediaItem.hash,
        mediaItem.width,
        mediaItem.height,
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
    const paginatedMedia = await getPaginatedMediaLib(startPage, pages);

    return {
      ...paginatedMedia,
      items: paginatedMedia.items.map((item) => ({
        ...item,
        blurDataURL: blurHashToDataURL(
          item.hash,
          item.width,
          item.height,
        ),
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