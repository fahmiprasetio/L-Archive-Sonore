import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/products';

// Bangun ulang sitemap setiap jam.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: {
    path: string;
    priority: number;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
  }[] = [
    { path: '/', priority: 1, changeFrequency: 'daily' },
    { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'monthly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((r) => ({
    url: r.path === '/' ? SITE_URL : `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Produk: ambil dari database bila terkonfigurasi, jika tidak pakai data bawaan.
  let products: { id: string; updated?: string | null }[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('products').select('id, created_at');
      if (Array.isArray(data)) {
        products = data.map((p: any) => ({ id: String(p.id), updated: p.created_at }));
      }
    } catch {
      // abaikan; fallback ke data bawaan di bawah
    }
  }
  if (products.length === 0) {
    products = PRODUCTS.map((p) => ({ id: p.id }));
  }

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: p.updated ? new Date(p.updated) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
