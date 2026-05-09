
import { Suspense } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { RowDataPacket } from "mysql2/promise";
import { queryMySql } from "@/utils/mysql/client";
import type { GroceryItem } from "@/types/grocery";
import styles from "./home.module.css";

type ItemRow = RowDataPacket & GroceryItem;

export const dynamic = "force-dynamic";

async function ItemGrid() {
  const rows = await queryMySql<ItemRow>(`SELECT id, name, price, unit, description, tag FROM items ORDER BY name`);
  const items: GroceryItem[] = rows.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    price: Number(row.price),
    unit: String(row.unit),
    description: String(row.description),
    tag: String(row.tag),
  }));

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article key={item.id} className={styles.card}>
          <span className={styles.tag}>{item.tag}</span>
          <h2 className={styles.name}>{item.name}</h2>
          <div className={styles.priceRow}>
            <span>${item.price.toFixed(2)}</span>
            <span>{item.unit}</span>
          </div>
          <div className={styles.actions}>
            <Link className={styles.link} href={`/items/${item.id}`}>
              View details
            </Link>
            <AddToCartButton item={item} />
          </div>
        </article>
      ))}
    </div>
  );
}

function GridFallback() {
  return <p className={styles.subtitle}>Loading items...</p>;
}

export default function Home() {

  return (
    <section>
      <div className={styles.hero}>
        <h1 className={styles.title}>Grocery staples</h1>
        <p className={styles.subtitle}>
          Keep your store stocked with quick add items.
        </p>
      </div>
      <Suspense fallback={<GridFallback />}>
        <ItemGrid />
      </Suspense>
    </section>
  );
}
