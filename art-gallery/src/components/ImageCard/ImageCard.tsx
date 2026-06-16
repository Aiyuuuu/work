// components/ImageCard/ImageCard.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./ImageCard.module.css";

export type ImageCardProps = {
  id: string;
  imageUrl: string;
  blurDataUrl?: string;
  href?: string;
  alt?: string;
};

export default function ImageCard({
  id,
  imageUrl,
  blurDataUrl,
  href = "#",
  alt = "image",
}: ImageCardProps) {
  return (
    <div className={styles.card} id={id}>
      <Link href={href} className={styles.link}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder={blurDataUrl ? "blur" : "empty"}
          blurDataURL={blurDataUrl}
        />
      </Link>
    </div>
  );
}