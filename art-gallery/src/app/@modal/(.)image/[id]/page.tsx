import { notFound } from "next/navigation";
import { getImageById } from "@/services/home/getImageById";
import ImageModal from "@/components/ImageModal/ImageModal";

export default async function ImageModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getImageById(id);

  if (!image) {
    notFound();
  }

  return <ImageModal image={image} />;
}