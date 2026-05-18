import Image from "next/image";
import styles from "./ImageCard.module.css";

export type ImageCardProps = {
  id: string;
  imageUrl: string;
  href?: string;
  alt?: string;
};

export default function ImageCard({
  id,
  imageUrl,
  href = "#",
  alt = "image",
}: ImageCardProps) {
  return (
    <div className={styles.card} id={id}>
      <a href={href} className={styles.link}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </a>
    </div>
  );
}