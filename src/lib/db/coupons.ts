import { supabaseAdmin } from '@/lib/supabase-admin';
import { calcDiscount, type Coupon } from '@/lib/coupons';

// Validasi kupon di SERVER (otoritatif). Memakai service-role sehingga bypass RLS.
// JANGAN diimpor di komponen client.

export interface CouponValidation {
  ok: boolean;
  error?: string;
  coupon?: Coupon;
  discount?: number;
}

interface CouponRow {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_subtotal: number | null;
  active: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  times_redeemed: number;
}

export async function validateCouponServer(
  codeRaw: string,
  subtotal: number
): Promise<CouponValidation> {
  if (!supabaseAdmin) {
    return { ok: false, error: 'Kupon tidak tersedia saat ini' };
  }

  const code = codeRaw.trim().toUpperCase();
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    console.error('Gagal memeriksa kupon:', error);
    return { ok: false, error: 'Gagal memeriksa kupon' };
  }
  if (!data) return { ok: false, error: 'Kode kupon tidak ditemukan' };

  const row = data as CouponRow;
  if (!row.active) return { ok: false, error: 'Kupon tidak aktif' };
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'Kupon sudah kedaluwarsa' };
  }
  if (row.max_redemptions != null && row.times_redeemed >= row.max_redemptions) {
    return { ok: false, error: 'Kuota kupon sudah habis' };
  }

  const min = Number(row.min_subtotal) || 0;
  if (subtotal < min) {
    return { ok: false, error: `Minimum belanja $${min.toLocaleString('en-US')} untuk kupon ini` };
  }

  const coupon: Coupon = {
    code: row.code,
    type: row.type,
    value: Number(row.value),
    min_subtotal: min,
  };
  const discount = calcDiscount(subtotal, coupon);
  if (discount <= 0) {
    return { ok: false, error: 'Kupon tidak memberi potongan untuk pesanan ini' };
  }

  return { ok: true, coupon, discount };
}
