import type { ReactNode } from "react";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});


export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <><div className={blackOpsOne.className}>{children}</div></>;
}