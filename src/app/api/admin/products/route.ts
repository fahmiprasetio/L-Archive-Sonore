import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';

function notConfigured() {
  return NextResponse.json(
    { error: 'Server Supabase admin belum dikonfigurasi (set SUPABASE_SERVICE_ROLE_KEY).' },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const payload = {
    id: `p_${Date.now()}`,
    name: body.name,
    description: body.description ?? '',
    price: Number(body.price) || 0,
    image_url: body.image_url ?? '',
    category: body.category ?? '',
    stock: typeof body.stock === 'number' ? body.stock : 0,
  };
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(payload)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PUT(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { id, updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates || {})
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const id = body.id;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
