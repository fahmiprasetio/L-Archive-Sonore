import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';

const ALLOWED_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
];

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server Supabase admin belum dikonfigurasi (set SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 503 }
    );
  }
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}

// Perbarui status pesanan (admin only).
export async function PUT(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server Supabase admin belum dikonfigurasi (set SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 503 }
    );
  }
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || !status) {
    return NextResponse.json({ error: 'Missing order id or status' }, { status: 400 });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
