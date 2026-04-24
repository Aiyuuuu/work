import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import QueryProvider from '@/components/QueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Assignment",
  description: "A simple task assignment dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900">
        <QueryProvider>
          <div className="min-h-screen">
            <header className="border-b border-slate-200 bg-white">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div>
                  <p className="text-sm font-medium text-slate-500">TaskApp</p>
                  <h2 className="text-lg font-semibold text-slate-900">Task assignment dashboard</h2>
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
