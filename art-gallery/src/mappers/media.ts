import type { IMedia } from "@/types/db";

export function mapMediaDocument({
  _id,
  __v,
  ...media
}: IMedia){
  const plainMedia = JSON.parse(JSON.stringify(media));

  return {
    id: _id.toString(),
    ...plainMedia,
  };
}