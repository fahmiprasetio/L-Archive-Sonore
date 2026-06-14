import { createClient } from '@supabase/supabase-js';

// Klien Supabase khusus SERVER memakai service-role key.
// JANGAN pernah diimpor di komponen client — key ini bypass RLS.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isAdminClientConfigured = (): boolean =>
  Boolean(url) && Boolean(serviceKey) && serviceKey !== 'your_supabase_service_role_key';

export const supabaseAdmin = isAdminClientConfigured()
  ? createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (null as any);
