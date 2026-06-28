import { NextResponse } from 'next/server';

// ============================================================================
// Pembatasan ukuran body untuk API route (mitigasi payload abuse / DoS memori)
// ============================================================================
// Tanpa batas ini, klien jahat bisa mengirim body JSON sangat besar dan memaksa
// server mengalokasikan banyak memori saat parsing. Helper di bawah:
//   1. Menolak cepat bila header `Content-Length` sudah melebihi batas (413).
//   2. Tetap menghitung ukuran sebenarnya saat membaca stream, karena
//      `Content-Length` bisa tidak ada atau dipalsukan.
//   3. Mem-parse JSON dan mengembalikan 400 bila body kosong / tidak valid.
//
// Pakai `readJsonLimited(request)` sebagai pengganti `request.json()`.
// ============================================================================

// 100 KB lebih dari cukup untuk cart, payload produk admin, dan webhook Midtrans.
export const DEFAULT_MAX_BODY_BYTES = 100 * 1024;

export type ReadJsonResult<T = unknown> =
  | { ok: true; value: T }
  | { ok: false; status: number; error: string };

export async function readJsonLimited<T = unknown>(
  request: Request,
  maxBytes: number = DEFAULT_MAX_BODY_BYTES
): Promise<ReadJsonResult<T>> {
  // 1) Cek cepat lewat Content-Length bila tersedia.
  const lenHeader = request.headers.get('content-length');
  if (lenHeader) {
    const len = Number(lenHeader);
    if (Number.isFinite(len) && len > maxBytes) {
      return { ok: false, status: 413, error: 'Request body too large' };
    }
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { ok: false, status: 400, error: 'Missing request body' };
  }

  // 2) Baca stream dengan penjaga ukuran (Content-Length bisa absen/dipalsukan).
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel().catch(() => {});
        return { ok: false, status: 413, error: 'Request body too large' };
      }
      chunks.push(value);
    }
  }

  // Gabungkan chunk -> text -> JSON.
  const merged = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }
  const text = new TextDecoder().decode(merged);
  if (text.trim().length === 0) {
    return { ok: false, status: 400, error: 'Missing request body' };
  }

  try {
    return { ok: true, value: JSON.parse(text) as T };
  } catch {
    return { ok: false, status: 400, error: 'Invalid JSON body' };
  }
}

export function bodyTooLargeResponse() {
  return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
}
