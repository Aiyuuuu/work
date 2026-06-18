

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import ImageCard from "../ImageCard/ImageCard";
import styles from "./ImageGrid.module.css";
import apiClient from "@/lib/axios/axios";
import type { HomeImage } from "@/services/home/getImages";

//AI response type
type ImagesApiResponse = {
  items: HomeImage[];
  startPage: number;
  pagesRequested: number;
  pagesReturned: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  nextStartPage: number | null;
};

type ImageGridProps = {
  initialImages: HomeImage[];
};

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
      const response = await apiClient.get<ImagesApiResponse>(
        `/api/images?page=${page}`,
      );

      const data = response.data;

      if (data.items.length === 0) {
        setHasMore(false);
        return;
      }

      setImages((prev) => {
        const existingIds = new Set(prev.map((img) => img._id));
        const uniqueNewImages = data.items.filter(
          (img) => !existingIds.has(img._id),
        );
        return [...prev, ...uniqueNewImages];
      });

      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load images:", error);
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
            key={img._id}
            id={img._id}
            href={`/image/${img._id}`}
            imageUrl={img.url}
            blurDataUrl={img.blurDataUrl}
            width={img.width}
            height={img.height}
            alt={`Image ${img.externalId}`}
          />
        ))}
      </Masonry>

      {loading && <div className={styles.loading}>Loading...</div>}

      {hasMore && <div ref={loaderRef} className={styles.sentinel} />}
    </main>
  );
}
