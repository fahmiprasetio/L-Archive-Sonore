import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore
  }
  return headers;
}

// Baca produk — publik (RLS select using true).
export async function fetchProductsDb(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as Product[];
}

// Tulis produk — lewat route server admin (service-role + cek admin).
export async function createProductDb(input: ProductInput): Promise<Product> {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal menambah produk');
  return json.product as Product;
}

export async function updateProductDb(
  id: string,
  updates: Partial<ProductInput>
): Promise<Product> {
  const res = await fetch('/api/admin/products', {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ id, updates }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal memperbarui produk');
  return json.product as Product;
}

export async function deleteProductDb(id: string): Promise<void> {
  const res = await fetch('/api/admin/products', {
    method: 'DELETE',
    headers: await authHeaders(),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Gagal menghapus produk');
  }
}
