import * as Sentry from "@sentry/nextjs";

// Dipanggil otomatis oleh Next.js saat server start (Node & Edge runtime).
// Memuat konfigurasi Sentry sesuai runtime yang aktif.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Tangkap error yang terjadi di server (RSC, route handler, dsb).
export const onRequestError = Sentry.captureRequestError;
