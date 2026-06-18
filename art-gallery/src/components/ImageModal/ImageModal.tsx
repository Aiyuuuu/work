// // components/ImageModal/ImageModal.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import styles from "./ImageModal.module.css";
// import type { SingleImage } from "@/types/services/home";

// type Props = {
//   image: SingleImage;
// };

// export default function ImageModal({ image }: Props) {
//   const router = useRouter();

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         router.back();
//       }
//     };

//     document.body.style.overflow = "hidden";
//     window.addEventListener("keydown", onKeyDown);

//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("keydown", onKeyDown);
//     };
//   }, [router]);

//   return (
//     <div className={styles.backdrop} onClick={() => router.back()}>
//       <div className={styles.content} onClick={(e) => e.stopPropagation()}>
//         <button className={styles.closeButton} onClick={() => router.back()}>
//           ×
//         </button>

//         <div className={styles.imageWrap}>
//           <Image
//             src={image.url}
//             alt={`Image ${image.externalId}`}
//             fill
//             className={styles.image}
//             sizes="90vw"
//             placeholder={image.blurDataUrl ? "blur" : "empty"}
//             blurDataURL={image.blurDataUrl}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ImageModal.module.css";
import type { SingleImage } from "@/types/services/home";

type Props = {
  image: SingleImage;
};

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatUnknown(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toLocaleString();

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (value.length <= 4 && value.every((v) => ["string", "number", "boolean"].includes(typeof v))) {
      return value.map(String).join(", ");
    }
    return `${value.length} item${value.length === 1 ? "" : "s"}`;
  }

  if (isRecord(value)) {
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }

  return "—";
}

function formatDate(value: unknown): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function prettyLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
}

function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.sectionCard}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

export default function ImageModal({ image }: Props) {
  const router = useRouter();

  const safeWidth = typeof image.width === "number" && image.width > 0 ? image.width : 1200;
  const safeHeight = typeof image.height === "number" && image.height > 0 ? image.height : 900;

  const orientation = useMemo(() => {
    const ratio = safeWidth / safeHeight;
    if (ratio >= 1.15) return "landscape";
    if (ratio <= 0.85) return "portrait";
    return "square";
  }, [safeWidth, safeHeight]);

  const stats = isRecord(image.stats) ? image.stats : null;
  const meta = isRecord(image.meta) ? image.meta : null;

  const metaEntries = useMemo(() => {
    if (!meta) return [];

    const importantKeys = new Set([
      "prompt",
      "negativePrompt",
      "steps",
      "seed",
      "sampler",
      "cfgScale",
      "clipSkip",
      "quantity",
      "workflow",
      "process",
      "baseModel",
      "width",
      "height",
      "Size",
      "aspectRatio",
      "Created Date",
      "resources",
      "civitaiResources",
      "draft",
      "disablePoi",
      "extra",
    ]);

    return Object.entries(meta).filter(([key, value]) => {
      if (importantKeys.has(key)) return false;
      if (value === null || value === undefined || value === "") return false;
      return true;
    });
  }, [meta]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [router]);

  return (
    <div className={styles.backdrop} onClick={() => router.back()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => router.back()}
          aria-label="Close image modal"
        >
          ×
        </button>

        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.heroCard}>
              <div className={styles.heroHeader}>
                <div>
                  <div className={styles.kicker}>Image {image.externalId}</div>
                  <h2 className={styles.title}>{image.username || "Unknown user"}</h2>
                </div>
                <div className={styles.badgeRow}>
                  {image.type ? <span className={styles.badge}>{image.type}</span> : null}
                  {image.baseModel ? <span className={styles.badge}>{image.baseModel}</span> : null}
                </div>
              </div>

              <div className={styles.imageFrame} data-orientation={orientation}>
                <Image
                  src={image.url}
                  alt={`Image ${image.externalId}`}
                  width={safeWidth}
                  height={safeHeight}
                  className={styles.image}
                  sizes="(max-width: 900px) 92vw, 60vw"
                  placeholder={image.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={image.blurDataUrl}
                  priority
                />
              </div>

              <div className={styles.metaGrid}>
                <InfoRow label="Resolution" value={`${safeWidth} × ${safeHeight}`} />
                <InfoRow label="Aspect ratio" value={safeWidth && safeHeight ? `${(safeWidth / safeHeight).toFixed(2)}:1` : "—"} />
                <InfoRow label="Browsing level" value={image.browsingLevel ?? "—"} />
                <InfoRow label="Created at" value={formatDate(image.createdAt)} />
                <InfoRow label="URL" value={<span className={styles.monoBreak}>{image.url}</span>} />
                <InfoRow label="Hash" value={<span className={styles.monoBreak}>{image.hash || "—"}</span>} />
              </div>
            </div>
          </div>

          <div className={styles.rightPane}>
            <CardSection title="Stats">
              {stats ? (
                <div className={styles.chipGrid}>
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className={styles.statChip}>
                      <span className={styles.statKey}>{prettyLabel(key)}</span>
                      <span className={styles.statValue}>{formatUnknown(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No stats available.</div>
              )}
            </CardSection>

            <CardSection title="Generation details">
              {meta ? (
                <div className={styles.detailsStack}>
                  <InfoRow label="Model" value={formatUnknown(meta.baseModel ?? image.baseModel)} />
                  <InfoRow label="Process" value={formatUnknown(meta.process)} />
                  <InfoRow label="Workflow" value={formatUnknown(meta.workflow)} />
                  <InfoRow label="Sampler" value={formatUnknown(meta.sampler)} />
                  <InfoRow label="Steps" value={formatUnknown(meta.steps)} />
                  <InfoRow label="CFG scale" value={formatUnknown(meta.cfgScale)} />
                  <InfoRow label="Clip skip" value={formatUnknown(meta.clipSkip)} />
                  <InfoRow label="Seed" value={formatUnknown(meta.seed)} />
                  <InfoRow label="Quantity" value={formatUnknown(meta.quantity)} />
                  <InfoRow label="Prompt" value={meta.prompt ? <pre className={styles.preBlock}>{String(meta.prompt)}</pre> : "—"} />
                  <InfoRow label="Negative prompt" value={meta.negativePrompt ? <pre className={styles.preBlock}>{String(meta.negativePrompt)}</pre> : "—"} />
                  <InfoRow label="Aspect ratio" value={formatUnknown(meta.aspectRatio)} />
                  <InfoRow label="Meta size" value={formatUnknown(meta.Size)} />
                  <InfoRow label="Meta dimensions" value={`${formatUnknown(meta.width)} × ${formatUnknown(meta.height)}`} />
                  <InfoRow label="Created Date" value={formatUnknown(meta["Created Date"])} />
                  <InfoRow
                    label="Resources"
                    value={
                      Array.isArray(meta.resources) ? (
                        meta.resources.length ? (
                          <span>{meta.resources.length} item{meta.resources.length === 1 ? "" : "s"}</span>
                        ) : (
                          "—"
                        )
                      ) : (
                        formatUnknown(meta.resources)
                      )
                    }
                  />
                  <InfoRow
                    label="Civitai resources"
                    value={
                      Array.isArray(meta.civitaiResources) ? (
                        <div className={styles.inlineList}>
                          {meta.civitaiResources.map((item, index) => {
                            if (!isRecord(item)) return <span key={index} className={styles.inlinePill}>Item</span>;
                            const type = formatUnknown(item.type);
                            const id = formatUnknown(item.modelVersionId);
                            const weight = item.weight !== undefined ? ` · ${formatUnknown(item.weight)}` : "";
                            return (
                              <span key={index} className={styles.inlinePill}>
                                {type} #{id}{weight}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        formatUnknown(meta.civitaiResources)
                      )
                    }
                  />
                  <InfoRow label="Extra" value={isRecord(meta.extra) ? formatUnknown(meta.extra) : formatUnknown(meta.extra)} />
                </div>
              ) : (
                <div className={styles.emptyState}>No generation metadata available.</div>
              )}
            </CardSection>

            <CardSection title="More metadata">
              {metaEntries.length ? (
                <div className={styles.detailsStack}>
                  {metaEntries.map(([key, value]) => (
                    <InfoRow key={key} label={prettyLabel(key)} value={formatUnknown(value)} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No additional metadata.</div>
              )}
            </CardSection>

            <CardSection title="Image record">
              <div className={styles.detailsStack}>
                <InfoRow label="ID" value={image._id} />
                <InfoRow label="External ID" value={image.externalId} />
                <InfoRow label="Username" value={image.username || "—"} />
                <InfoRow label="Base model" value={image.baseModel || "—"} />
                <InfoRow label="Type" value={image.type || "—"} />
              </div>
            </CardSection>
          </div>
        </div>
      </div>
    </div>
  );
}