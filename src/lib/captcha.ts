// ============================================================================
// Verifikasi CAPTCHA (Cloudflare Turnstile) di sisi SERVER.
// ============================================================================
// Konsisten dengan pola env-driven proyek ini: bila TURNSTILE_SECRET_KEY TIDAK
// diset, verifikasi otomatis DILEWATI (captcha opsional) sehingga app tetap
// berjalan tanpa konfigurasi. Aktifkan captcha dengan mengisi:
//   - NEXT_PUBLIC_TURNSTILE_SITE_KEY (klien, publik)
//   - TURNSTILE_SECRET_KEY          (server, rahasia)
// ============================================================================

export interface CaptchaResult {
  ok: boolean;
  error?: string;
}

// True bila captcha diberlakukan di server (secret key terisi).
export const isCaptchaEnforced = (): boolean => Boolean(process.env.TURNSTILE_SECRET_KEY);

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verifikasi token Turnstile yang dikirim klien.
 * - Bila secret key kosong -> { ok: true } (captcha nonaktif).
 * - Bila token kosong/invalid -> { ok: false }.
 */
export async function verifyCaptcha(token: unknown, ip?: string): Promise<CaptchaResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY || '';
  if (!secret) return { ok: true }; // captcha nonaktif (opsional)

  if (typeof token !== 'string' || token.trim() === '') {
    return { ok: false, error: 'Verifikasi keamanan (captcha) diperlukan' };
  }

  try {
    const body = new URLSearchParams();
    body.append('secret', secret);
    body.append('response', token);
    if (ip && ip !== 'unknown') body.append('remoteip', ip);

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (!data.success) {
      return { ok: false, error: 'Verifikasi keamanan gagal. Coba lagi.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Gagal memverifikasi captcha. Coba lagi.' };
  }
}
