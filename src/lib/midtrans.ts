// @ts-ignore - midtrans-client does not have official ts definitions
import midtransClient from 'midtrans-client';

// Mode produksi dikontrol lewat env agar sandbox (dev) & production bisa diganti
// TANPA ubah kode. Set MIDTRANS_IS_PRODUCTION=true di Vercel (Production).
// Fallback ke NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION agar konsisten dengan pemilihan
// Snap script di sisi klien (src/app/checkout/page.tsx).
export const IS_MIDTRANS_PRODUCTION =
  (
    process.env.MIDTRANS_IS_PRODUCTION ||
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION ||
    'false'
  ).toLowerCase() === 'true';

export const snap = new midtransClient.Snap({
  isProduction: IS_MIDTRANS_PRODUCTION,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});
