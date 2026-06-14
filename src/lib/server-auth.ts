import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminEmail } from '@/lib/admin';

// Ambil user dari Authorization: Bearer <access_token> (token sesi Supabase).
export async function getUserFromRequest(request: Request) {
  if (!supabaseAdmin) return null;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

// Pastikan pemanggil adalah admin (berdasarkan allowlist email).
export async function requireAdmin(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return null;
  if (!isAdminEmail(user.email)) return null;
  return user;
}
