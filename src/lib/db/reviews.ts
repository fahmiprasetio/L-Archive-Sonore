import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

// Ulasan untuk sebuah produk — publik (RLS select using true).
export async function fetchReviewsDb(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}

// Tambah ulasan atas nama user yang login.
export async function addReviewDb(input: {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: input.productId,
      user_id: userId,
      author: input.author.trim() || 'Anonymous',
      rating: Math.min(5, Math.max(1, Math.round(input.rating))),
      comment: input.comment.trim(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as Review;
}
