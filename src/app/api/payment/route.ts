import { NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getUserFromRequest } from '@/lib/server-auth';
import { validateCartItems, validateCustomerDetails } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Rate limit: 10 permintaan checkout per menit per IP.
  const ip = getClientIp(request);
  const rl = rateLimit(`payment:${ip}`, 10, 60_000);
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

    // Generate a unique order ID
    const orderId = `LARCHIVE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Calculate gross amount
    const grossAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

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
      item_details: items.map((item) => ({
        id: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
        name: item.product.name.substring(0, 50), // Midtrans character limit
      })),
    };

    // Call Midtrans Snap API to get transaction token and redirect url
    const transaction = await snap.createTransaction(parameter);

    // Catat order (status pending) memakai service-role. user_id diisi bila login.
    if (supabaseAdmin) {
      try {
        const user = await getUserFromRequest(request);
        await supabaseAdmin.from('orders').insert({
          id: orderId,
          user_id: user?.id ?? null,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_address: customerDetails.address || '',
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total: grossAmount,
          status: 'pending',
        });
      } catch (e) {
        console.error('Gagal mencatat order ke Supabase:', e);
      }
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
