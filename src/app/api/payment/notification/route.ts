import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateMidtransNotification } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';
import { readJsonLimited } from '@/lib/body-limit';

export const runtime = 'nodejs';

// Webhook (Payment Notification) dari Midtrans.
// Set URL ini di dashboard Midtrans: https://<domain>/api/payment/notification
export async function POST(request: Request) {
  // Rate limit longgar untuk webhook: 120 permintaan per menit per IP.
  const ip = getClientIp(request);
  const rl = await rateLimit(`midtrans-notif:${ip}`, 120, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  try {
    // Baca body dengan batas ukuran (mitigasi payload abuse).
    const bodyResult = await readJsonLimited(request);
    if (!bodyResult.ok) {
      return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
    }
    const parsed = validateMidtransNotification(bodyResult.value);
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

    if (status === 'paid') {
      // Transisi ke 'paid' dilakukan dengan update BERSYARAT (.neq status 'paid').
      // Hanya transisi PERTAMA yang mengembalikan baris, sehingga pengurangan
      // stok dijamin berjalan tepat satu kali meski webhook terkirim berkali-kali.
      const { data: updated } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order_id)
        .neq('status', 'paid')
        .select('id, items');

      const justPaid = updated && updated.length > 0 ? updated[0] : null;
      if (justPaid && Array.isArray(justPaid.items) && justPaid.items.length > 0) {
        // Pengurangan stok ATOMIK lewat Postgres function decrement_product_stock.
        // Setiap baris dikunci & dikurangi dalam satu statement SQL, sehingga aman
        // dari race condition saat banyak checkout produk yang sama bersamaan
        // (menggantikan pola read-then-write lama yang rawan overselling).
        const { error: stockErr } = await supabaseAdmin.rpc('decrement_product_stock', {
          p_items: justPaid.items,
        });
        if (stockErr) {
          // Order sudah 'paid'; jangan gagalkan webhook. Catat untuk ditindaklanjuti.
          console.error('Gagal mengurangi stok (atomic RPC):', stockErr);
        }
      }
    } else {
      // Status lain (pending/failed): cukup perbarui status order.
      await supabaseAdmin.from('orders').update({ status }).eq('id', order_id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Midtrans notification error:', error);
    return NextResponse.json({ error: error.message || 'Notification error' }, { status: 500 });
  }
}
