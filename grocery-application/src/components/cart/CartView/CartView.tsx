"use client";

import { useMemo } from "react";
import { useCartQuery, useClearCartMutation, useRemoveCartItemMutation } from "@/lib/cartQueries";
import styles from "./cart.module.css";

export default function CartView() {
  const { data: items } = useCartQuery();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();
  const isMutating = removeMutation.isPending || clearMutation.isPending;

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);


  return (
    <div className={styles.cart}>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.row}>
            <div>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemMeta}>
                {item.quantity} x ${item.price.toFixed(2)}
              </p>
            </div>
            <button
              className={styles.ghostButton}
              type="button"
              onClick={() => removeMutation.mutate(item.id)}
              disabled={isMutating}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className={styles.summary}>
        <p>Total</p>
        <p className={styles.total}>${total.toFixed(2)}</p>
      </div>
      <button
        className={styles.primaryButton}
        type="button"
        onClick={() => clearMutation.mutate()}
        disabled={isMutating}
      >
        Clear cart
      </button>
    </div>
  );
}
