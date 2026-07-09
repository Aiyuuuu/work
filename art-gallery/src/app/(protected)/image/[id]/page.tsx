import { notFound } from "next/navigation";
import { getMediaByMediaId } from "@/services/media";
import ImagePageClient from "./ImagePageClient";

export default async function ImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getMediaByMediaId(id);

  if (!media.success) {
    notFound();
  }

  return <ImagePageClient image={media.data} />;
}
