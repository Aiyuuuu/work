// components/ImageModal/ImageModal.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ImageModal.module.css";
import type { SingleImage } from "@/services/home/getImageById";

type Props = {
  image: SingleImage;
};

export default function ImageModal({ image }: Props) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [router]);

  return (
    <div className={styles.backdrop} onClick={() => router.back()}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => router.back()}>
          ×
        </button>

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
      </div>
    </div>
  );
}