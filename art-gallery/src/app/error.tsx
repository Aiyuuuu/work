"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Error Boundary Caught:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1
        className={blackOpsOne.className}
        style={{
          fontSize: "clamp(1.5rem, 6vw, 5rem)",
          color: "#e64980",
          marginBottom: "16px",
          textShadow: "0 0 20px rgba(230, 73, 128, 0.4)",
          lineHeight: 1,
        }}
      >
        ERROR
      </h1>
      <p
        style={{
            fontFamily: "arial",
          color: "#a0aec0",
          maxWidth: "480px",
          fontSize: "clamp(0.85rem, 2vw, 1rem)",
          marginBottom: "32px",
          lineHeight: "1.6",
        }}
      >
        A system-level error occurred while executing this route. This has been logged and our engineering team is investigating.
      </p>
      <button
        onClick={() => reset()}
        style={{
            fontFamily: "arial",
          padding: "12px 32px",
          backgroundColor: "#845ef7",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(132, 94, 247, 0.4)",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        RETRY
      </button>
    </div>
  );
}