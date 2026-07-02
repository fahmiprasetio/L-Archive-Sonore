import { supabase } from '@/lib/supabase';

// Helper CLIENT-side untuk mengelola kupon lewat route admin (/api/admin/coupons).
// Route server melakukan cek admin + service-role; file ini aman diimpor di komponen client.

export interface AdminCoupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_subtotal: number | null;
  active: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  times_redeemed: number;
}

export interface CouponInput {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_subtotal?: number;
  active?: boolean;
  expires_at?: string | null;
  max_redemptions?: number | null;
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore
  }
  return headers;
}

export async function fetchAllCouponsAdmin(): Promise<AdminCoupon[]> {
  const res = await fetch('/api/admin/coupons', { headers: await authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal memuat kupon');
  return (json.coupons || []) as AdminCoupon[];
}

export async function createCouponAdmin(input: CouponInput): Promise<AdminCoupon> {
  const res = await fetch('/api/admin/coupons', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal membuat kupon');
  return json.coupon as AdminCoupon;
}

export async function updateCouponAdmin(
  code: string,
  updates: Partial<CouponInput>
): Promise<AdminCoupon> {
  const res = await fetch('/api/admin/coupons', {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ code, updates }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal memperbarui kupon');
  return json.coupon as AdminCoupon;
}

export async function deleteCouponAdmin(code: string): Promise<void> {
  const res = await fetch('/api/admin/coupons', {
    method: 'DELETE',
    headers: await authHeaders(),
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Gagal menghapus kupon');
  }
}
