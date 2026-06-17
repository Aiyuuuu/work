
import Link from "next/link";
import Image from "next/image";
import styles from "./ImageCard.module.css";

export type ImageCardProps = {
  id: string;
  imageUrl: string;
  blurDataUrl?: string;
  width?: number | null;
  height?: number | null;
  href?: string;
  alt?: string;
};

export default function ImageCard({
  id,
  imageUrl,
  blurDataUrl,
  width,
  height,
  href = "#",
  alt = "image",
}: ImageCardProps) {
  const safeWidth = typeof width === "number" && width > 0 ? width : 800;
  const safeHeight = typeof height === "number" && height > 0 ? height : 800;

  return (
    <div className={styles.card} id={id}>
      <Link href={href} className={styles.link}>
        <Image
          src={imageUrl}
          alt={alt}
          width={safeWidth}
          height={safeHeight}
          className={styles.image}
          placeholder={blurDataUrl ? "blur" : "empty"}
          blurDataURL={blurDataUrl}
        />
      </Link>
    </div>
  );
}