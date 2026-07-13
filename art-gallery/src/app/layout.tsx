// app/layout.tsx
import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
        {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}