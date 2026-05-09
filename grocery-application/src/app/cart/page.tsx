import CartView from "@/components/cart/CartView";
import styles from "./cart.module.css";

export default function CartPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Your cart</h1>
      <div className={styles.card}>
        <CartView />
      </div>
    </section>
  );
}
