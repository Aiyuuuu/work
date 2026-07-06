import { notFound } from "next/navigation";
import { getMediaByMediaId } from "@/services/media";
import ImageModal from "@/components/ImageModal/ImageModal";

export default async function ImageModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getMediaByMediaId(id);

  if (!media) {
    notFound();
  }

  return <ImageModal image={media} />;
}
