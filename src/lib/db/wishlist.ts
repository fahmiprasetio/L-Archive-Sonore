import { supabase } from '@/lib/supabase';

// Product IDs yang disimpan user (RLS membatasi ke auth.uid() = user_id).
export async function fetchWishlistDb(): Promise<string[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r: { product_id: string }) => r.product_id);
}

// Tambah produk ke wishlist user yang login (idempoten via upsert).
export async function addWishlistDb(productId: string): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('wishlists')
    .upsert(
      { user_id: userId, product_id: productId },
      { onConflict: 'user_id,product_id' }
    );
  if (error) throw error;
}

// Hapus produk dari wishlist (RLS memastikan hanya baris milik user).
export async function removeWishlistDb(productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('product_id', productId);
  if (error) throw error;
}
