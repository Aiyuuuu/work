import type { ReactNode } from "react";
import Header from "@/components/header/Header";

export default function ProtectedLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      {modal}
    </>
  );
}