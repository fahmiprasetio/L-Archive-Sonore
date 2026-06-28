"use client";

// global-error menangkap error yang terjadi di root layout (di luar error.tsx).
// Karena menggantikan layout, ia wajib merender <html> & <body> sendiri.
// Tailwind (globals.css) tidak termuat di sini, jadi pakai inline style.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

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
      <body
        style=
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
        
      >
        <h1 style= fontSize: "1.5rem", fontWeight: 700, margin: 0 >
          Terjadi kesalahan tak terduga
        </h1>
        <p style= maxWidth: "28rem", color: "#737373", margin: 0 >
          Maaf, aplikasi mengalami gangguan. Tim kami sudah diberi tahu secara
          otomatis. Silakan muat ulang halaman.
        </p>
        {error?.digest ? (
          <p style= fontSize: "0.75rem", color: "#a3a3a3", margin: 0 >
            Ref: {error.digest}
          </p>
        ) : null}
        <a
          href="/"
          style=
            display: "inline-block",
            borderRadius: "9999px",
            background: "#171717",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          
        >
          Kembali ke beranda
        </a>
      </body>
    </html>
  );
}
