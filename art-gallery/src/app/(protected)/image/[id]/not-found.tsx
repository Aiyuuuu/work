// src/app/(protected)/image/[id]/not-found.tsx

import Link from "next/link";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

export default function ImageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1
        className={blackOpsOne.className}
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "#e64980", // Branded pink accent
          marginBottom: "16px",
          textShadow: "0 0 20px rgba(230, 73, 128, 0.4)",
          lineHeight: 1,
        }}
      >
        NOT FOUND
      </h1>
      <p
        style={{
          color: "#a0aec0",
          maxWidth: "480px",
          fontSize: "14px",
          marginBottom: "32px",
          lineHeight: "1.6",
        }}
      >
        The requested media could not be resolved. It may have been deleted, archived, or is temporarily unavailable.
      </p>
      <Link
        href="/home"
        style={{
          padding: "10px 24px",
          border: "1px solid #845ef7", // Branded purple border
          color: "#845ef7",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        ← RETURN TO HOME
      </Link>
    </div>
  );
}