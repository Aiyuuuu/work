import ImageGrid from "@/components/ImageGrid/ImageGrid";
import styles from "./home.module.css";
import { getPaginatedMedia } from "@/services/media/mediaService";

export default async function HomePage() {
  const result = await getPaginatedMedia(1, 1);

  return (
    <div className={styles.imageGridContainer}>
      <ImageGrid initialImages={result.items} />
    </div>
  );
}
