import CartView from "@/components/cart/CartView/CartView";
import styles from "./cart.module.css";
import { Suspense } from "react";


function CartFallback() {
  return <p className={styles.subtitle}>Loading Cart items...</p>;
}


export default function CartPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Your cart</h1>
      <div className={styles.card}>
        <Suspense fallback={<CartFallback></CartFallback>}>
        <CartView />
        </Suspense>
      </div>
    </section>
  );
}
