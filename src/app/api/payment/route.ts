import { NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerDetails } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email) {
      return NextResponse.json({ error: 'Missing customer details' }, { status: 400 });
    }

    // Generate a unique order ID
    const orderId = `LARCHIVE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Calculate gross amount
    const grossAmount = items.reduce(
      (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
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
      item_details: items.map((item: CartItem) => ({
        id: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
        name: item.product.name.substring(0, 50), // Midtrans character limit
      })),
    };

    // Call Midtrans Snap API to get transaction token and redirect url
    const transaction = await snap.createTransaction(parameter);

    // Catat order ke Supabase (status pending) bila Supabase terkonfigurasi.
    if (supabase) {
      try {
        await supabase.from('orders').insert({
          id: orderId,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_address: customerDetails.address || '',
          items: items.map((item: CartItem) => ({
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
