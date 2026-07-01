// Perhitungan diskon MURNI (tanpa I/O) agar bisa dipakai & diuji di server.
// Nilai kupon (aktif/expiry/kuota) divalidasi terpisah di src/lib/db/coupons.ts.

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  code: string;
  type: CouponType;
  value: number;
  min_subtotal?: number;
}

/**
 * Hitung nominal potongan (mata uang) dari subtotal.
 * - percent: value diperlakukan sebagai persen (di-clamp 0..100)
 * - fixed: value adalah nominal potongan
 * Hasil dibulatkan & di-clamp agar tidak melebihi subtotal (tidak pernah negatif).
 */
export function calcDiscount(subtotal: number, coupon: Coupon | null | undefined): number {
  if (!coupon || subtotal <= 0) return 0;
  const min = coupon.min_subtotal ?? 0;
  if (subtotal < min) return 0;

  let d = 0;
  if (coupon.type === 'percent') {
    const pct = Math.min(Math.max(coupon.value, 0), 100);
    d = subtotal * (pct / 100);
  } else {
    d = Math.max(coupon.value, 0);
  }
  return Math.min(Math.round(d), subtotal);
}
