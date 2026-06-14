// Penentuan admin via daftar email (allowlist).
// Bisa di-override lewat env NEXT_PUBLIC_ADMIN_EMAILS (dipisah koma).
// Jika env kosong, pakai fallback default di bawah.

const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Email admin default (dipakai bila env belum diisi). Ubah sesuai kebutuhan.
const FALLBACK_ADMIN_EMAILS = ['nfahmi086@gmail.com'];

export const ADMIN_EMAILS = envAdmins.length > 0 ? envAdmins : FALLBACK_ADMIN_EMAILS;

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
