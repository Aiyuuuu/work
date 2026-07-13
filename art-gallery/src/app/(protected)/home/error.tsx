"use client"; // Error boundaries must be Client Components [2]

import { useEffect } from "react";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Gallery Page Error Caught:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          padding: "40px",
          background: "rgba(13, 14, 17, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "12px",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h2
          className={blackOpsOne.className}
          style={{
            fontSize: "1.8rem",
            color: "#e64980",
            marginBottom: "12px",
            letterSpacing: "0.05em",
          }}
        >
          ERROR
        </h2>
        <p
          style={{
            fontFamily: "arial",
            color: "#a0aec0",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          An unexpected error occurred while fetching data
        </p>
        <button
          onClick={() => reset()}
          style={{
            fontFamily: "arial",

            padding: "10px 24px",
            backgroundColor: "#845ef7", 
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(132, 94, 247, 0.4)",
          }}
        >
          RETRY
        </button>
      </div>
    </div>
  );
}