import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isUrlValid = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');
const isKeyValid = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key';

export const supabase = isUrlValid && isKeyValid
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
