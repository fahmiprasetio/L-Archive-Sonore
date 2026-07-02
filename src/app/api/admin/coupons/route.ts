import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/server-auth';
import { validateCouponCode, isPlainObject } from '@/lib/validation';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';
import { readJsonLimited } from '@/lib/body-limit';

export const runtime = 'nodejs';

function notConfigured() {
  return NextResponse.json(
    { error: 'Server Supabase admin belum dikonfigurasi (set SUPABASE_SERVICE_ROLE_KEY).' },
    { status: 503 }
  );
}

function limited(request: Request) {
  const ip = getClientIp(request);
  return rateLimit(`admin-coupons:${ip}`, 60, 60_000);
}

type CouponFields = {
  type?: 'percent' | 'fixed';
  value?: number;
  min_subtotal?: number;
  active?: boolean;
  expires_at?: string | null;
  max_redemptions?: number | null;
};

// Validasi field kupon. requireAll=true untuk create, false untuk update parsial.
function validateCouponFields(
  input: unknown,
  requireAll: boolean
): { ok: true; value: CouponFields } | { ok: false; error: string } {
  if (!isPlainObject(input)) return { ok: false, error: 'Invalid coupon payload' };
  const out: CouponFields = {};

  if (requireAll || 'type' in input) {
    const t = input.type;
    if (t !== 'percent' && t !== 'fixed') {
      return { ok: false, error: "Coupon type must be 'percent' or 'fixed'" };
    }
    out.type = t;
  }

  if (requireAll || 'value' in input) {
    const v = Number(input.value);
    if (!Number.isFinite(v) || v <= 0) {
      return { ok: false, error: 'Coupon value must be a positive number' };
    }
    out.value = v;
  }

  if (requireAll || 'min_subtotal' in input) {
    const raw = input.min_subtotal;
    if (raw === null || raw === undefined || raw === '') {
      out.min_subtotal = 0;
    } else {
      const m = Number(raw);
      if (!Number.isFinite(m) || m < 0) {
        return { ok: false, error: 'Minimum subtotal must be zero or greater' };
      }
      out.min_subtotal = Math.round(m);
    }
  }

  if (requireAll || 'active' in input) {
    out.active = input.active === undefined ? true : Boolean(input.active);
  }

  if (requireAll || 'expires_at' in input) {
    const raw = input.expires_at;
    if (raw === null || raw === undefined || raw === '') {
      out.expires_at = null;
    } else {
      const d = new Date(String(raw));
      if (Number.isNaN(d.getTime())) {
        return { ok: false, error: 'Invalid expiry date' };
      }
      out.expires_at = d.toISOString();
    }
  }

  if (requireAll || 'max_redemptions' in input) {
    const raw = input.max_redemptions;
    if (raw === null || raw === undefined || raw === '') {
      out.max_redemptions = null;
    } else {
      const n = Number(raw);
      if (!Number.isInteger(n) || n <= 0) {
        return { ok: false, error: 'Max redemptions must be a positive integer' };
      }
      out.max_redemptions = n;
    }
  }

  // Batasi persentase pada rentang 1..100.
  if (out.type === 'percent' && typeof out.value === 'number' && (out.value < 1 || out.value > 100)) {
    return { ok: false, error: 'Percent value must be between 1 and 100' };
  }

  return { ok: true, value: out };
}

export async function GET(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .order('code', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupons: data || [] });
}

export async function POST(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const bodyResult = await readJsonLimited<any>(request);
  if (!bodyResult.ok) return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
  const body = bodyResult.value;

  const codeResult = validateCouponCode(body?.code);
  if (!codeResult.ok) return NextResponse.json({ error: codeResult.error }, { status: 400 });

  const fields = validateCouponFields(body, true);
  if (!fields.ok) return NextResponse.json({ error: fields.error }, { status: 400 });

  const payload = {
    code: codeResult.value,
    ...fields.value,
    times_redeemed: 0,
  };

  const { data, error } = await supabaseAdmin
    .from('coupons')
    .insert(payload)
    .select()
    .single();
  if (error) {
    if ((error as any).code === '23505') {
      return NextResponse.json({ error: 'Kode kupon sudah dipakai' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ coupon: data });
}

export async function PUT(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const bodyResult = await readJsonLimited<any>(request);
  if (!bodyResult.ok) return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
  const body = bodyResult.value;

  const codeResult = validateCouponCode(body?.code);
  if (!codeResult.ok) return NextResponse.json({ error: codeResult.error }, { status: 400 });

  const fields = validateCouponFields(body?.updates, false);
  if (!fields.ok) return NextResponse.json({ error: fields.error }, { status: 400 });
  if (Object.keys(fields.value).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('coupons')
    .update(fields.value)
    .eq('code', codeResult.value)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupon: data });
}

export async function DELETE(request: Request) {
  if (!supabaseAdmin) return notConfigured();
  const rl = await limited(request);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const bodyResult = await readJsonLimited<any>(request);
  if (!bodyResult.ok) return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
  const body = bodyResult.value;

  const codeResult = validateCouponCode(body?.code);
  if (!codeResult.ok) return NextResponse.json({ error: codeResult.error }, { status: 400 });

  const { error } = await supabaseAdmin.from('coupons').delete().eq('code', codeResult.value);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
