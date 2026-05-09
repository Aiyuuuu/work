import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import styles from "../item.module.css";
import type { RowDataPacket } from "mysql2/promise";
import { queryMySql } from "@/utils/mysql/client";
import type { GroceryItem } from "@/types/grocery";

type ItemRow = RowDataPacket & GroceryItem;

export const dynamic = "force-dynamic";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const rows = await queryMySql<ItemRow>(`SELECT id, name, price, unit, description, tag FROM items WHERE id = ? LIMIT 1`, [params.id]);
  const row = rows.rows[0];
  const item: GroceryItem | undefined = row
    ? {
        id: String(row.id),
        name: String(row.name),
        price: Number(row.price),
        unit: String(row.unit),
        description: String(row.description),
        tag: String(row.tag),
      }
    : undefined;

  if (!item) {
    notFound();
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <span className={styles.badge}>{item.tag}</span>
        <h1 className={styles.title}>{item.name}</h1>
        <p className={styles.meta}>
          ${item.price.toFixed(2)} · {item.unit}
        </p>
        <p className={styles.description}>{item.description}</p>
      </div>
      <div className={styles.card}>
        <div className={styles.sidebar}>
          <h2>Quick add</h2>
          <p className={styles.meta}>Add this item to your cart.</p>
          <AddToCartButton item={item} />
        </div>
      </div>
    </section>
  );
}
