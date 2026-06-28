import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/server-auth';
import { validateNewProduct, validateProductUpdates, isNonEmptyString } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function notConfigured() {
  return NextResponse.json(
    { error: 'Server Supabase admin belum dikonfigurasi (set SUPABASE_SERVICE_ROLE_KEY).' },
    { status: 503 }
  );
}

function limited(request: Request) {
  const ip = getClientIp(request);
  return rateLimit(`admin-products:${ip}`, 60, 60_000);
}

export async function POST(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const result = validateNewProduct(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const payload = {
    id: `p_${Date.now()}`,
    ...result.value,
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
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || !isNonEmptyString(body.id)) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const result = validateProductUpdates(body.updates);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(result.value)
    .eq('id', body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  if (!isNonEmptyString(body.id)) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from('products').delete().eq('id', body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
