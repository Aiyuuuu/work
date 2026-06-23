import { notFound } from "next/navigation";
import { getImageById } from "@/services/home/getImageById";
import ImagePageClient from "./ImagePageClient";

export default async function ImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getImageById(id);

  if (!image) {
    notFound();
  }

  return <ImagePageClient image={image} />;
}