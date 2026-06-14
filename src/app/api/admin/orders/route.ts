import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';

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
