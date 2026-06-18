import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Discover, collect, inspire</p>

          <h1 className={styles.heading}>ART GALLERY</h1>

          <p className={styles.description}>
            Explore a stunning collection of contemporary, AI and classical artworks.
            Discover masterpieces and find the perfect piece for your collection.
          </p>

          <Link href="/auth"><button className={styles.exploreBtn}>Explore Artworks</button></Link>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.imageFrame}>
            <Image
              src="/landingImage.webp"
              alt="Featured artwork"
              fill
              priority
              className={styles.heroImage}
              sizes="(max-width: 768px) 90vw, 45vw"
              unoptimized
            />
          </div>

          <div className={styles.floatingCardOne}>
            <Image
              src="/landingImage1.webp"
              alt="Artwork preview one"
              fill
              className={styles.previewImage}
              sizes="180px"
            />
          </div>

          <div className={styles.floatingCardTwo}>
            <Image
              src="/landingImage2.webp"
              alt="Artwork preview two"
              fill
              className={styles.previewImage}
              sizes="160px"
            />
          </div>
        </div>
      </section>
    </main>
  );
}