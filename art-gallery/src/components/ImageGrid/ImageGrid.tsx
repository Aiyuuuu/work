"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import ImageCard from "../ImageCard/ImageCard";
import styles from "./ImageGrid.module.css";
import apiClient from "@/lib/axios/apiClient";
import type { ImageCardProps } from "../ImageCard/ImageCard";
import { API_ENDPOINTS } from "@/constants/apiConstants";
import { MAX_REQUESTED_PAGES } from "@/constants/imageConstants";

export interface ImageGridProps {
  initialImages: ImageCardProps[];
}

export default function ImageGrid({ initialImages }: ImageGridProps) {
  const [images, setImages] = useState(initialImages);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.MEDIA.getPaginatedMedia.ENDPOINT}?startPage=${page}&pages=${MAX_REQUESTED_PAGES}`,
      );

      const data = response.data.data;

      setImages((prev) => {
        const existingIds = new Set(prev.map((img) => img.id));

        const uniqueImages = data.items.filter(
          (img: ImageCardProps) => !existingIds.has(img.id),
        );

        return [...prev, ...uniqueImages];
      });

      setHasMore(data.hasMore);

      if (data.nextStartPage !== null) {
        setPage(data.nextStartPage);
      }
    } catch (err) {
      console.error("Failed to load media", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    const current = loaderRef.current;

    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "500px",
      },
    );

    observer.observe(current);

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <main className={styles.container}>
      <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={2}>
        {images.map((img) => (
          <ImageCard
            key={img.id}
            id={img.id}
            href={`/image/${img.id}`}
            url={img.url}
            blurDataURL={img.blurDataURL!}
            width={img.width}
            height={img.height}
            alt={`Image ${img.id}`}
          />
        ))}
      </Masonry>

      {loading && <div className={styles.loading}>Loading...</div>}

      {hasMore && <div ref={loaderRef} className={styles.sentinel} />}
    </main>
  );
}
