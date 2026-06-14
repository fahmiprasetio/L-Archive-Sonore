import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateMidtransNotification } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Webhook (Payment Notification) dari Midtrans.
// Set URL ini di dashboard Midtrans: https://<domain>/api/payment/notification
export async function POST(request: Request) {
  // Rate limit longgar untuk webhook: 120 permintaan per menit per IP.
  const ip = getClientIp(request);
  const rl = rateLimit(`midtrans-notif:${ip}`, 120, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  try {
    const body = await request.json().catch(() => null);
    const parsed = validateMidtransNotification(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = parsed.value;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    // Verifikasi signature: sha512(order_id + status_code + gross_amount + serverKey)
    const expected = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (!signature_key || signature_key !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Petakan status Midtrans ke status order kita.
    let status = 'pending';
    if (transaction_status === 'settlement') {
      status = 'paid';
    } else if (transaction_status === 'capture') {
      status = fraud_status === 'deny' ? 'failed' : 'paid';
    } else if (['deny', 'cancel', 'expire', 'failure'].includes(transaction_status)) {
      status = 'failed';
    } else if (transaction_status === 'pending') {
      status = 'pending';
    }

    // Ambil order untuk tahu status sebelumnya & item (untuk kurangi stok sekali saja).
    const { data: existing } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    await supabaseAdmin.from('orders').update({ status }).eq('id', order_id);

    if (
      status === 'paid' &&
      existing &&
      existing.status !== 'paid' &&
      Array.isArray(existing.items)
    ) {
      for (const item of existing.items) {
        const { data: prod } = await supabaseAdmin
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
        if (prod) {
          const current = typeof prod.stock === 'number' ? prod.stock : 0;
          const newStock = Math.max(0, current - (item.quantity || 0));
          await supabaseAdmin.from('products').update({ stock: newStock }).eq('id', item.id);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Midtrans notification error:', error);
    return NextResponse.json({ error: error.message || 'Notification error' }, { status: 500 });
  }
}
