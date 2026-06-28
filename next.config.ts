import type { NextConfig } from "next";

// ============================================================================
// Security headers + Content-Security-Policy
// ============================================================================
// Diterapkan ke SEMUA route lewat next.config `headers()`.
//
// Catatan penting soal CSP:
// - Midtrans Snap memuat script & membuka iframe ke domain Midtrans, jadi
//   domain tsb harus diizinkan di script-src/frame-src/connect-src.
// - Next.js + React menyuntikkan sebagian style & script inline (hydration),
//   sehingga 'unsafe-inline' (style) dan 'unsafe-inline'/'unsafe-eval' (script)
//   masih diperlukan agar aplikasi tidak rusak. Ini trade-off pragmatis;
//   bisa diperketat nanti dengan CSP berbasis nonce + middleware.
// - Supabase realtime memakai WebSocket (wss://*.supabase.co).
// ============================================================================

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com https://*.midtrans.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.midtrans.com`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://app.sandbox.midtrans.com https://app.midtrans.com https://api.sandbox.midtrans.com https://api.midtrans.com`,
  `frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com https://*.midtrans.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
