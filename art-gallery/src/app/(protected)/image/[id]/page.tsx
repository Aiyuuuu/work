// app/image/[id]/page.tsx
import { notFound } from "next/navigation";
import { getImageById } from "@/services/home/getImageById";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

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

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <Link href="/home" className={styles.backLink}>
          ← Back
        </Link>
      </div>

      <div className={styles.imageWrap}>
        <Image
          src={image.url}
          alt={`Image ${image.externalId}`}
          fill
          className={styles.image}
          sizes="90vw"
          placeholder={image.blurDataUrl ? "blur" : "empty"}
          blurDataURL={image.blurDataUrl}
        />
      </div>
    </main>
  );
}