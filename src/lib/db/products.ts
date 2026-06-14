import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

const TABLE = 'products';

export async function fetchProductsDb(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as Product[];
}

export async function createProductDb(input: ProductInput): Promise<Product> {
  const payload = { ...input, id: `p_${Date.now()}` };
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProductDb(
  id: string,
  updates: Partial<ProductInput>
): Promise<Product> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProductDb(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
