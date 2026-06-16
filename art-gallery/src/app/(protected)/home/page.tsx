import ImageGrid from "@/components/ImageGrid/ImageGrid";
import styles from "./home.module.css";
import { getImages } from "@/services/home/getImages";

export default async function HomePage() {
  const result = await getImages(1, 1);

  return (
    <div className={styles.imageGridContainer}>
      <ImageGrid initialImages={result.items} />
    </div>
  );
}