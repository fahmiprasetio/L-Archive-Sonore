'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProductStore } from '@/store/productStore';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import { toast } from '@/store/toastStore';
import type { Product } from '@/types';

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const wlLoaded = useWishlistStore((s) => s.loaded);
  const clear = useWishlistStore((s) => s.clear);
  const loadWishlist = useWishlistStore((s) => s.load);
  const products = useProductStore((s) => s.products);
  const productsLoaded = useProductStore((s) => s.loaded);
  const loadProducts = useProductStore((s) => s.loadProducts);

  useEffect(() => {
    loadWishlist();
    loadProducts();
  }, [loadWishlist, loadProducts]);

  const saved = useMemo<Product[]>(() => {
    return ids
      .map((id) => products.find((p) => p.id === id) || MOCK_PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [ids, products]);

  const handleClear = async () => {
    try {
      await clear();
      toast.info('Wishlist cleared');
    } catch {
      toast.error('Failed to clear wishlist');
    }
  };

  if (!wlLoaded || !productsLoaded) {
    return (
      <div className="py-12 text-center text-neutral-500">
        <p className="text-lg font-medium">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-neutral-600 transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-neutral-900">
          <Heart className="h-7 w-7 fill-red-500 text-red-500" /> My Wishlist
        </h1>
        {saved.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-neutral-500 transition hover:text-red-600"
          >
            Clear all
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 font-semibold text-neutral-700">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-neutral-500">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
