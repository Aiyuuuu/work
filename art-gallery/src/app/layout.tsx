// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/header/Header";

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {modal}
      </body>
    </html>
  );
}