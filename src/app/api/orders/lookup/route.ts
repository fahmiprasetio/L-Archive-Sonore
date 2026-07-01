import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isNonEmptyString, isValidEmail } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';
import { readJsonLimited } from '@/lib/body-limit';

export const runtime = 'nodejs';

// Pelacakan pesanan untuk GUEST (tanpa login).
// Order guest tersimpan dengan user_id NULL, jadi tidak bisa diambil lewat RLS
// (auth.uid() = user_id). Endpoint ini memakai service_role (bypass RLS) TAPI
// hanya mengembalikan order bila pasangan (order_id + email) COCOK — sehingga
// order milik orang lain tidak bisa dienumerasi.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`order-lookup:${ip}`, 15, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  const bodyResult = await readJsonLimited<{ order_id?: unknown; email?: unknown }>(request);
  if (!bodyResult.ok) {
    return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
  }
  const { order_id, email } = bodyResult.value;

  if (!isNonEmptyString(order_id)) {
    return NextResponse.json({ error: 'Order ID diperlukan' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server belum dikonfigurasi (Supabase service role).' },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(
      'id, customer_name, customer_email, customer_address, items, total, discount, coupon_code, status, created_at'
    )
    .eq('id', order_id.trim())
    .limit(1);

  if (error) {
    console.error('Gagal mencari order:', error);
    return NextResponse.json({ error: 'Gagal mencari pesanan. Coba lagi.' }, { status: 500 });
  }

  const order = data && data.length > 0 ? data[0] : null;

  // Bandingkan email case-insensitive. Jangan bocorkan apakah order_id ada atau
  // tidak: pesan error sama untuk "tidak ada" maupun "email tidak cocok".
  if (
    !order ||
    String(order.customer_email).trim().toLowerCase() !== email.trim().toLowerCase()
  ) {
    return NextResponse.json(
      { error: 'Pesanan tidak ditemukan. Periksa Order ID dan email Anda.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
