import styles from "./auth.module.css";

export default function AuthPage() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to manage your grocery list.</p>
        <form className={styles.form} action="/api/auth/login" method="post">
          <input type="hidden" name="mode" value="login" />
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="you@shop.com"
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </label>
          <button className={styles.primaryButton} type="submit">
            Login
          </button>
        </form>
      </div>

      <div className={styles.cardAlt}>
        <h2 className={styles.title}>Create account</h2>
        <p className={styles.subtitle}>Set up a new store profile.</p>
        <form className={styles.form} action="/api/auth/login" method="post">
          <input type="hidden" name="mode" value="signup" />
          <label className={styles.label}>
            Store name
            <input
              className={styles.input}
              type="text"
              name="storeName"
              placeholder="Fresh Basket"
            />
          </label>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="team@shop.com"
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Create a password"
            />
          </label>
          <button className={styles.primaryButton} type="submit">
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}
