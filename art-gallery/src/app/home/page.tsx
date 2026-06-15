import ImageCard from "@/components/ImageCard/ImageCard";
import styles from "./home.module.css";
import { getImages } from "@/services/home/getImages";

export default async function HomePage() {
  // Load the first page of images
  const result = await getImages(1, 1);

  return (
    <main className={styles.container}>
      <div className={styles.grid}>
        {result.items.map((img) => (
          <ImageCard
            key={img._id}
            id={img._id}
            imageUrl={img.url}
            alt={`Image ${img.externalId}`}
          />
        ))}
      </div>
    </main>
  );
}