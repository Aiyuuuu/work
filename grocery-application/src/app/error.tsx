"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled error in App Router:", error);
  }, [error]);

  return (
        <section style={{ maxWidth: 720, textAlign: "center" }}>
          <h1 style={{ marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: "#444", marginBottom: 18 }}>{error?.message ?? "An unexpected error occurred."}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={() => reset()} style={{ padding: "8px 12px" }}>
              Try again
            </button>
          </div>
        </section>
  );
}
