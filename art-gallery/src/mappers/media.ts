import type { IMedia as DbMedia } from "@/types/db";
import type { IMedia } from "@/types/lib";

export function mapMediaDocument({
  _id,
  __v,
  ...media
}: DbMedia): IMedia {
  const plainMedia = JSON.parse(JSON.stringify(media));

  return {
    id: _id.toString(),
    ...plainMedia,
  };
}