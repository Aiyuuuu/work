"use client";

import type { GroceryItem } from "@/types/grocery";
import { useAddCartItemMutation } from "@/components/cart/cartQueries";
import styles from "./cart.module.css";

export default function AddToCartButton({ item }: { item: GroceryItem }) {
  const addMutation = useAddCartItemMutation();

  const isLoading = addMutation.isPending;

  return (
    <button
      className={styles.primaryButton}
      type="button"
      onClick={() => addMutation.mutate(item.id)}
      disabled={isLoading}
    >
      {isLoading ? "Adding..." : "Add to cart"}
    </button>
  );
}
