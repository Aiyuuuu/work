import Link from "next/link";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

export default function NotFound() {
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
          fontSize: "clamp(4rem, 10vw, 8rem)",
          color: "#e64980",
          marginBottom: "16px",
          textShadow: "0 0 20px rgba(230, 73, 128, 0.4)",
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <h2
        className={blackOpsOne.className}
        style={{
          fontSize: "clamp(1.2rem, 3vw, 2.5rem)",
          marginBottom: "16px",
          color: "#ffffff",
          letterSpacing: "0.05em",
        }}
      >
        NOT FOUND
      </h2>
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
        You have navigated to an invalid address or an expired dynamic link.
        Verify the URL and try again.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "arial",
          padding: "12px 32px",
          backgroundColor: "#845ef7",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
          boxShadow: "0 4px 14px rgba(132, 94, 247, 0.4)",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        RETURN
      </Link>
    </div>
  );
}
