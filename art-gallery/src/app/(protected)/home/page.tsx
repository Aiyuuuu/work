import ImageGrid from "@/components/ImageGrid/ImageGrid";
import styles from "./home.module.css";
import { getPaginatedMedia } from "@/services/media";
import { getSuccessResponseData } from "@/services/_response";

export default async function HomePage() {
  const getPaginatedMediaServiceResponse = await getPaginatedMedia(1, 1);

  if(!getPaginatedMediaServiceResponse.success){
    return(<div className={styles.imageGridContainer}>
    </div>)
  }

  const serviceResponseData = getSuccessResponseData(getPaginatedMediaServiceResponse)

  return (
    <div className={styles.imageGridContainer}>
      <ImageGrid initialImages={serviceResponseData.items} />
    </div>
  );
}
