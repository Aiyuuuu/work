
import { ReactNode } from "react";
import Link from "next/link";
import Providers from "@/components/Providers/Providers";
import "./globals.css";
import styles from "./layout.module.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <Providers>
          <div className={styles.shell}>
            <header className={styles.header}>
              <span className={styles.brand}>GrocerEase</span>
              <nav className={styles.nav}>
                <Link className={styles.link} href="/">
                  Home
                </Link>
                <Link className={styles.link} href="/cart">
                  Cart
                </Link>
                <Link className={styles.link} href="/auth">
                  Auth
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className={styles.logoutButton} type="submit">
                    Sign out
                  </button>
                </form>
              </nav>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}