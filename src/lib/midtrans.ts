// @ts-ignore - midtrans-client does not have official ts definitions
import midtransClient from 'midtrans-client';
import { SITE_URL } from '@/lib/site';

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

// Instance Snap dari library (dipertahankan untuk kompatibilitas).
export const snap = new midtransClient.Snap({
  isProduction: IS_MIDTRANS_PRODUCTION,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

// Endpoint Snap "create transaction" sesuai environment.
const SNAP_TRANSACTION_URL = IS_MIDTRANS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export interface SnapResult {
  token: string;
  redirect_url: string;
}

/**
 * Buat transaksi Snap via REST langsung agar bisa menyetel header
 * `X-Override-Notification`. Dengan override ini, SATU akun Midtrans dapat
 * melayani BANYAK website: tiap project mengirim notifikasi pembayaran ke
 * webhook-nya sendiri tanpa mengubah setelan Notification URL global di
 * dashboard (yang hanya menyediakan satu kolom per akun).
 */
export async function createSnapTransaction(
  parameter: Record<string, unknown>,
  options?: { notificationUrl?: string }
): Promise<SnapResult> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const auth = Buffer.from(`${serverKey}:`).toString('base64');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  };
  if (options?.notificationUrl) {
    headers['X-Override-Notification'] = options.notificationUrl;
  }

  const res = await fetch(SNAP_TRANSACTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(parameter),
  });

  const data = await res.json().catch(() => ({} as Record<string, unknown>));
  if (!res.ok) {
    const errMessages = (data as { error_messages?: unknown }).error_messages;
    const statusMessage = (data as { status_message?: unknown }).status_message;
    const msg = Array.isArray(errMessages)
      ? errMessages.join('; ')
      : (typeof statusMessage === 'string' && statusMessage) || `Midtrans error (${res.status})`;
    throw new Error(msg);
  }
  return {
    token: String((data as { token?: unknown }).token || ''),
    redirect_url: String((data as { redirect_url?: unknown }).redirect_url || ''),
  };
}

/**
 * Tentukan Notification URL (webhook) untuk transaksi ini.
 * Prioritas:
 *   1. env MIDTRANS_NOTIFICATION_URL  (override eksplisit, opsional)
 *   2. domain request saat ini        (otomatis — mendukung banyak project/domain)
 *   3. SITE_URL                        (cadangan terakhir)
 * Selalu menunjuk ke endpoint /api/payment/notification.
 */
export function resolveNotificationUrl(request: Request): string {
  const explicit = process.env.MIDTRANS_NOTIFICATION_URL;
  if (explicit && explicit.trim()) return explicit.trim();

  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const base = host ? `${proto}://${host}` : SITE_URL;
  return `${base.replace(/\/$/, '')}/api/payment/notification`;
}
