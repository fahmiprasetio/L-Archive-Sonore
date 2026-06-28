"use client";

// global-error menangkap error yang terjadi di root layout (di luar error.tsx).
// Karena menggantikan layout, ia wajib merender <html> & <body> sendiri.
// Tailwind (globals.css) tidak termuat di sini, jadi pakai inline style.

import * as Sentry from "@sentry/nextjs";
import { useEffect, type CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "1.5rem",
    textAlign: "center",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    background: "#fafafa",
    color: "#171717",
  },
  title: { fontSize: "1.5rem", fontWeight: 700, margin: 0 },
  text: { maxWidth: "28rem", color: "#737373", margin: 0 },
  ref: { fontSize: "0.75rem", color: "#a3a3a3", margin: 0 },
  link: {
    display: "inline-block",
    borderRadius: "9999px",
    background: "#171717",
    color: "#ffffff",
    padding: "0.75rem 1.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="id">
      <body style={styles.body}>
        <h1 style={styles.title}>Terjadi kesalahan tak terduga</h1>
        <p style={styles.text}>
          Maaf, aplikasi mengalami gangguan. Tim kami sudah diberi tahu secara
          otomatis. Silakan muat ulang halaman.
        </p>
        {error?.digest ? <p style={styles.ref}>Ref: {error.digest}</p> : null}
        <a href="/" style={styles.link}>
          Kembali ke beranda
        </a>
      </body>
    </html>
  );
}
