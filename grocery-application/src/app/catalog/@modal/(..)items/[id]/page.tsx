import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2/promise";
import AddToCartButton from "@/components/cart/AddToCartButton/AddToCartButton";
import type { GroceryItem } from "@/types/grocery";
import { queryMySql } from "@/utils/db/client";
import ModalCloseButton from "@/components/ItemModal/ModalCloseButton/ModalCloseButton";
import ModalOpenFullPageButton from "@/components/ItemModal/ModalOpenFullPageButton/ModalOpenFullPageButton";
import styles from "./modal.module.css";

type ItemRow = RowDataPacket & GroceryItem;

export const dynamic = "force-dynamic";

export default async function CatalogItemModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await queryMySql<ItemRow>(
    `SELECT id, name, price, unit, description, tag FROM items WHERE id = ? LIMIT 1`,
    [id]
  );

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
    <div className={styles.backdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${item.name} details`}>
        <div className={styles.header}>
          <span className={styles.badge}>{item.tag}</span>
          <ModalCloseButton />
        </div>
        <h2 className={styles.title}>{item.name}</h2>
        <p className={styles.meta}>
          ${item.price.toFixed(2)} · {item.unit}
        </p>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.actions}>
          <AddToCartButton item={item} />
          <ModalOpenFullPageButton itemId={item.id} />
        </div>
      </div>
    </div>
  );
}