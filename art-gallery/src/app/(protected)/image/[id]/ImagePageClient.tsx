"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

// Prop types to render this component..............................
export interface IStats {
  cryCount: number;
  laughCount: number;
  likeCount: number;
  dislikeCount: number;
  heartCount: number;
  commentCount: number;
}

export interface IMeta {
  prompt?: string;
  negativePrompt?: string;
  seed?: number;
  sampler?: string;
  steps?: number;
  cfgScale?: number;
  clipSkip?: number;
}

export interface ImagePageClientProps {
  image: {
    id: string;
    blurDataURL: string;
    externalId: number;
    url: string;
    hash: string;
    baseModel: string | null;
    browsingLevel: number;
    width: number;
    height: number;
    type: "image" | "video";
    createdAt: Date;
    username: string;
    stats: IStats;
    meta: IMeta | null;
  };
}
//...............................................................

export default function ImagePageClient({ image }: ImagePageClientProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Safety Check: If the video is already cached and ready on mount, fade it in immediately
      if (video.readyState >= 3) {
        setVideoLoaded(true);
      }
    }
  }, []);

  return (
    <div className={styles.page}>
      {/* Background Video (Fades in over solid dark foundation) */}
      <video
        ref={videoRef}
        src="/stars_1080p_30fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        className={`${styles.bgVideo} ${videoLoaded ? styles.bgVideoLoaded : ""}`}
      />

      {/* Topbar with Back Link */}
      <div className={styles.topbar}>
        <Link href="/home" className={styles.backLink}>
          ← Back
        </Link>
      </div>

      {/* Main Content Pane */}
      <div className={styles.content}>
        <div
          className={styles.imageWrap}
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.url}
            alt={`Image ${image.externalId}`}
            fill
            className={styles.image}
            sizes="90vw"
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL!}
          />
        </div>

        <div className={`${styles.infoContainer} ${blackOpsOne.className}`}>
          <div className={styles.infoHeading}>IMAGE INFO</div>
          <div className={styles.infoBody}>
            {image.externalId && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>External ID :</div>
                <div className={styles.infoBodyValues}>{image.externalId}</div>
              </div>
            )}

            {image.baseModel && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Base Model :</div>
                <div className={styles.infoBodyValues}>{image.baseModel}</div>
              </div>
            )}

            {image.type && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Type :</div>
                <div className={styles.infoBodyValues}>{image.type}</div>
              </div>
            )}

            {!!image.width && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Width :</div>
                <div className={styles.infoBodyValues}>{image.width}</div>
              </div>
            )}

            {!!image.height && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Height :</div>
                <div className={styles.infoBodyValues}>{image.height}</div>
              </div>
            )}

            {image.createdAt && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Created At :</div>
                <div className={styles.infoBodyValues}>
                  {image.createdAt
                    ? new Date(image.createdAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            )}

            {image.username && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Username :</div>
                <div className={styles.infoBodyValues}>{image.username}</div>
              </div>
            )}

            {!!image.meta?.seed && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Seed :</div>
                <div className={styles.infoBodyValues}>{image.meta?.seed.toString()}</div>
              </div>
            )}

            {image.meta?.sampler && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Sampler :</div>
                <div className={styles.infoBodyValues}>
                  {image.meta?.sampler}
                </div>
              </div>
            )}

            {!!image.meta?.steps && (
              <div className={styles.miniInfoBox}>
                <div className={styles.infoBodyLabels}>Steps :</div>
                <div className={styles.infoBodyValues}>{image.meta?.steps}</div>
              </div>
            )}

            {image.stats && (
              <div className={styles.statsContainer}>
                <div className={styles.cryCount}>😢{image.stats.cryCount}</div>
                <div className={styles.laughCount}>
                  😂{image.stats.laughCount}
                </div>
                <div className={styles.likeCount}>
                  😍{image.stats.likeCount}
                </div>
                <div className={styles.dislikeCount}>
                  👎{image.stats.dislikeCount}
                </div>
                <div className={styles.heartCount}>
                  ❤️{image.stats.heartCount}
                </div>
                <div className={styles.commentCount}>
                  💬{image.stats.commentCount}
                </div>
              </div>
            )}

            {image.meta?.prompt && (
              <div className={styles.promptContainer}>
                <div className={styles.promptHeading}>PROMPT</div>
                <div className={styles.promptText}>{image.meta?.prompt}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
