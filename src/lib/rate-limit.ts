import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiter terdistribusi.
//
// - Bila UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN diset, memakai
//   Upstash Redis (sliding window) sehingga batas KONSISTEN lintas instance
//   serverless (Vercel). Ini wajib untuk produksi skala besar.
// - Bila tidak diset (mis. dev lokal), otomatis fallback ke limiter in-memory
//   per-instance — cukup untuk pengembangan.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms
}

// ---------------------------------------------------------------------------
// Upstash (produksi / serverless)
// ---------------------------------------------------------------------------
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

// Cache limiter per kombinasi (limit, window) agar tidak dibuat berulang.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: 'larchive-rl',
      analytics: false, // hemat command Upstash
    });
    limiterCache.set(cacheKey, limiter);
  }
  return limiter;
}

// ---------------------------------------------------------------------------
// Fallback in-memory (dev lokal / saat Upstash belum dikonfigurasi)
// ---------------------------------------------------------------------------
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function rateLimitMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (Math.random() < 0.01) cleanup(now); // bersih-bersih sesekali

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

// ---------------------------------------------------------------------------
// API utama (async)
// ---------------------------------------------------------------------------
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(limit, windowMs);
  if (limiter) {
    try {
      const res = await limiter.limit(key);
      return { allowed: res.success, remaining: res.remaining, resetAt: res.reset };
    } catch (e) {
      // Bila Redis bermasalah, jangan kunci pengguna — fallback ke memori.
      console.error('Upstash rate limit error, fallback ke in-memory:', e);
      return rateLimitMemory(key, limit, windowMs);
    }
  }
  return rateLimitMemory(key, limit, windowMs);
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export function tooManyRequestsResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}
