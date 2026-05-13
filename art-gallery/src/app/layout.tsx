import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Art Gallery",
  description: "Art gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
