import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/products';

type ProductMeta = { name: string; description?: string; image_url?: string } | null;

async function getProduct(id: string): Promise<ProductMeta> {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('products')
        .select('name, description, image_url')
        .eq('id', id)
        .single();
      if (data) return data as ProductMeta;
    } catch {
      // fallback ke data bawaan
    }
  }
  const local = PRODUCTS.find((p) => p.id === id);
  return local
    ? { name: local.name, description: local.description, image_url: local.image_url }
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const description = (
    product.description || `${product.name} — available at ${SITE_NAME}.`
  ).slice(0, 160);
  const path = `/products/${id}`;
  const images = product.image_url
    ? [{ url: product.image_url, alt: product.name }]
    : undefined;

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: product.name,
      description,
      url: `${SITE_URL}${path}`,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
