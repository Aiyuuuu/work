import { notFound } from "next/navigation";
import { getMediaByMediaId } from "@/services/media";
import ImagePageClient from "./ImagePageClient";

export default async function ImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getMediaByMediaId(id);

  if (!image) {
    notFound();
  }

  return <ImagePageClient image={image} />;
}
