import * as Sentry from "@sentry/nextjs";

// DSN tidak rahasia; bisa diisi via NEXT_PUBLIC_SENTRY_DSN atau SENTRY_DSN.
const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // Hanya aktif di production & saat DSN tersedia.
  enabled: process.env.NODE_ENV === "production" && Boolean(dsn),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  // Jangan kirim PII secara default (privasi pengguna).
  sendDefaultPii: false,
});
