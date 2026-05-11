import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <body style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 24 }}>
        <section style={{ maxWidth: 720, textAlign: "center" }}>
          <h1 style={{ marginBottom: 8 }}>Page not found</h1>
          <p style={{ color: "#444", marginBottom: 18 }}>The page you are looking for does not exist.</p>
          <Link href="/" style={{ color: "#1a7f4b", fontWeight: 600 }}>
            Go home
          </Link>
        </section>
      </body>
    </html>
  );
}
