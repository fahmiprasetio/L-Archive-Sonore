import { NextResponse } from 'next/server';
import { validateCouponCode } from '@/lib/validation';
import { validateCouponServer } from '@/lib/db/coupons';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';
import { readJsonLimited } from '@/lib/body-limit';

export const runtime = 'nodejs';

// Validasi kupon untuk pratinjau di checkout. Perhitungan final tetap dilakukan
// ulang secara otoritatif di /api/payment — endpoint ini hanya untuk UX.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`coupon:${ip}`, 20, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  const bodyResult = await readJsonLimited<{ code?: unknown; subtotal?: unknown }>(request);
  if (!bodyResult.ok) {
    return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
  }
  const body = bodyResult.value;

  const codeResult = validateCouponCode(body?.code);
  if (!codeResult.ok) {
    return NextResponse.json({ error: codeResult.error }, { status: 400 });
  }

  const subtotal = Number(body?.subtotal);
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json({ error: 'Invalid subtotal' }, { status: 400 });
  }

  const result = await validateCouponServer(codeResult.value, subtotal);
  if (!result.ok) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 200 });
  }

  return NextResponse.json({
    valid: true,
    code: result.coupon!.code,
    discount: result.discount,
    type: result.coupon!.type,
    value: result.coupon!.value,
  });
}
