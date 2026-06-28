import * as Sentry from "@sentry/nextjs";

// Konfigurasi Sentry sisi browser (Next.js 15.3+ memakai instrumentation-client).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // Hanya kirim event di production & saat DSN tersedia, agar dev lokal bersih.
  enabled: process.env.NODE_ENV === "production" && Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
  ),
  // Session Replay nonaktif secara default; nyalakan lewat env bila diperlukan.
  replaysSessionSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? 0,
  ),
  replaysOnErrorSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? 0,
  ),
});

// Instrumentasi transisi navigasi App Router.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
