import Link from "next/link";
import Image from "next/image";
import styles from "./ImageCard.module.css";
import { isValidWidthAndHeight } from "@/utils/validation/widthAndHeight";
import { SAFE_HEIGHT, SAFE_WIDTH } from "@/constants/imageConstants";

// minimum type required to render this component
export interface ImageCardProps {
  id: string;
  url: string;
  blurDataURL: string;
  width?: number;
  height?: number;
  href?: string;
  alt?: string;
}

export default function ImageCard({
  id,
  url,
  blurDataURL,
  width,
  height,
  href = "#",
  alt = "image",
}: ImageCardProps) {
  let safeWidth;
  let safeHeight;
  if (width && height && isValidWidthAndHeight(width, height)) {
    safeWidth = width;
    safeHeight = height;
  } else {
    safeWidth = SAFE_WIDTH;
    safeHeight = SAFE_HEIGHT;
  }
  return (
    <div className={styles.card} id={id}>
      <Link href={href} className={styles.link}>
        <Image
          src={url}
          alt={alt}
          width={safeWidth}
          height={safeHeight}
          className={styles.image}
          placeholder={"blur"}
          blurDataURL={blurDataURL}
        />
      </Link>
    </div>
  );
}
