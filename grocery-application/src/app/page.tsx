
import Link from "next/link";
import styles from "./home.module.css";

// export const revalidate = false; // Static Site Generation
export const revalidate = 60; // ISR, regenerate page after 60 seconds

export default function Home() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Fresh stock, calm days</span>
          <h1 className={styles.title}>Groceries that keep your store ready</h1>
          <p className={styles.subtitle}>Order fast, refill smart, and keep your best items in reach.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/catalog">
              Browse catalog
            </Link>
            <Link className={styles.secondaryButton} href="/cart">
              View cart
            </Link>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.panelRow}>
            <span>Live restock</span>
            <strong>24 min</strong>
          </div>
          <div className={styles.panelRow}>
            <span>Popular items</span>
            <strong>120+</strong>
          </div>
          <div className={styles.panelRow}>
            <span>Weekly savings</span>
            <strong>18%</strong>
          </div>
          <p className={styles.subtitle}>Check the items that move every day and keep margins steady.</p>
        </div>
      </div>

      <section>
        <h2 className={styles.sectionTitle}>What you get</h2>
        <p className={styles.sectionSub}>Simple tools that save time and reduce waste.</p>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Fast reorder</h3>
            <p className={styles.cardText}>Reuse last week’s cart in one click. Add or remove items in seconds.</p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Clear pricing</h3>
            <p className={styles.cardText}>See unit price and pack size at a glance. No surprises.</p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Smart favorites</h3>
            <p className={styles.cardText}>Pin top sellers so your team finds them fast.</p>
          </article>
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepLabel}>Step 1</div>
            <p className={styles.cardText}>Open the catalog and pick essentials.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepLabel}>Step 2</div>
            <p className={styles.cardText}>Review your cart and adjust quantities.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepLabel}>Step 3</div>
            <p className={styles.cardText}>Confirm and track delivery in one place.</p>
          </div>
        </div>
      </section>

      <section className={styles.quote}>
        <p className={styles.quoteText}>
          “GrocerEase keeps our shelves full and our team calm. We finish orders in minutes.”
        </p>
        <p className={styles.quoteMeta}>Maya Patel · Corner Market</p>
      </section>

      <section className={styles.ctaBand}>
        <p className={styles.ctaText}>Ready to restock with less work?</p>
        <Link className={styles.primaryButton} href="/catalog">
          Start now
        </Link>
      </section>
    </section>
  );
}
