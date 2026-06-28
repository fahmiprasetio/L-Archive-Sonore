import { NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getUserFromRequest } from '@/lib/server-auth';
import { validateCartItems, validateCustomerDetails } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';
import { calcShipping, calcTax } from '@/lib/pricing';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Rate limit: 10 permintaan checkout per menit per IP.
  const ip = getClientIp(request);
  const rl = await rateLimit(`payment:${ip}`, 10, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const itemsResult = validateCartItems(body.items);
    if (!itemsResult.ok) {
      return NextResponse.json({ error: itemsResult.error }, { status: 400 });
    }
    const customerResult = validateCustomerDetails(body.customerDetails);
    if (!customerResult.ok) {
      return NextResponse.json({ error: customerResult.error }, { status: 400 });
    }

    const items = itemsResult.value;
    const customerDetails = customerResult.value;

    // PENTING (keamanan): harga & stok HARUS diambil dari database sebagai
    // sumber otoritatif. Jangan pernah mempercayai harga yang dikirim klien —
    // kalau tidak, pembeli bisa mengubah harga di browser (mis. price: 1) dan
    // membayar jauh lebih murah dari seharusnya.
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server belum dikonfigurasi (Supabase service role).' },
        { status: 500 }
      );
    }

    const ids = items.map((item) => item.product.id);
    const { data: dbProducts, error: dbErr } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock')
      .in('id', ids);

    if (dbErr) {
      console.error('Gagal memeriksa produk:', dbErr);
      return NextResponse.json(
        { error: 'Gagal memeriksa produk. Coba lagi.' },
        { status: 500 }
      );
    }

    const dbMap = new Map((dbProducts ?? []).map((p) => [p.id, p]));

    // Validasi ketersediaan + stok terhadap data terbaru (otoritatif).
    const issues: string[] = [];
    for (const item of items) {
      const dbp = dbMap.get(item.product.id);
      if (!dbp) {
        issues.push(`Produk \"${item.product.name}\" sudah tidak tersedia`);
        continue;
      }
      const stock = typeof dbp.stock === 'number' ? dbp.stock : 0;
      if (stock <= 0) {
        issues.push(`\"${dbp.name}\" sedang habis`);
      } else if (item.quantity > stock) {
        issues.push(`\"${dbp.name}\" hanya tersisa ${stock} (diminta ${item.quantity})`);
      }
    }

    if (issues.length > 0) {
      return NextResponse.json(
        { error: `Stok tidak mencukupi: ${issues.join('; ')}` },
        { status: 409 }
      );
    }

    // Generate a unique order ID
    const orderId = `LARCHIVE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Bangun line items dari HARGA DATABASE (bukan harga klien).
    const lineItems = items.map((item) => {
      const dbp = dbMap.get(item.product.id)!;
      const price = typeof dbp.price === 'number' ? dbp.price : Number(dbp.price) || 0;
      return {
        id: dbp.id,
        name: String(dbp.name),
        price,
        quantity: item.quantity,
      };
    });

    // Hitung subtotal, ongkir, pajak. gross_amount = subtotal + shipping + tax.
    const subtotal = lineItems.reduce((sum, li) => sum + li.price * li.quantity, 0);
    const shipping = calcShipping(subtotal);
    const tax = calcTax(subtotal);
    const grossAmount = subtotal + shipping + tax;

    // item_details harus berjumlah sama dengan gross_amount (syarat Midtrans),
    // jadi ongkir & pajak ditambahkan sebagai baris tersendiri.
    const itemDetails: Array<{ id: string; price: number; quantity: number; name: string }> =
      lineItems.map((li) => ({
        id: li.id,
        price: li.price,
        quantity: li.quantity,
        name: li.name.substring(0, 50), // Midtrans character limit
      }));
    if (shipping > 0) {
      itemDetails.push({ id: 'SHIPPING', price: shipping, quantity: 1, name: 'Shipping' });
    }
    if (tax > 0) {
      itemDetails.push({ id: 'TAX', price: tax, quantity: 1, name: 'Tax (PPN 11%)' });
    }

    // Prepare transaction payload for Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        billing_address: {
          address: customerDetails.address || '',
        },
        shipping_address: {
          address: customerDetails.address || '',
        },
      },
      item_details: itemDetails,
    };

    // Call Midtrans Snap API to get transaction token and redirect url
    const transaction = await snap.createTransaction(parameter);

    // Catat order (status pending) memakai service-role. user_id diisi bila login.
    // Snapshot order memakai harga database (otoritatif), bukan harga klien.
    try {
      const user = await getUserFromRequest(request);
      await supabaseAdmin.from('orders').insert({
        id: orderId,
        user_id: user?.id ?? null,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_address: customerDetails.address || '',
        items: lineItems.map((li) => ({
          id: li.id,
          name: li.name,
          price: li.price,
          quantity: li.quantity,
        })),
        total: grossAmount,
        status: 'pending',
      });
    } catch (e) {
      console.error('Gagal mencatat order ke Supabase:', e);
    }

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error('Midtrans Snap transaction creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
