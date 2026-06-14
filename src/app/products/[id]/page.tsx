'use client';

import { use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/products';
import type { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ProductWithSpecs = Product & { specs?: string[] };

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const products = useProductStore((s) => s.products);
  const loaded = useProductStore((s) => s.loaded);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const product = useMemo<ProductWithSpecs | undefined>(() => {
    const fromStore = products.find((p) => p.id === id);
    const fromMock = MOCK_PRODUCTS.find((p) => p.id === id);
    if (fromStore) {
      return fromMock?.specs ? { ...fromStore, specs: fromMock.specs } : fromStore;
    }
    return fromMock;
  }, [products, id]);

  if (!product) {
    if (!loaded) {
      return (
        <div className="py-12 text-center text-neutral-500">
          <p className="text-lg font-medium">Loading product...</p>
        </div>
      );
    }
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Product Not Found</h2>
        <p className="mt-2 text-neutral-600">The product you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-neutral-900 underline font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="aspect-square w-full rounded bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-neutral-900 mt-1">
                {product.name}
              </h1>
            </div>

            <p className="text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-neutral-950 mb-2">Specifications</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600">
                  {product.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Price</span>
              <p className="text-3xl font-bold text-neutral-900">
                ${product.price.toLocaleString('en-US')}
              </p>
            </div>
            <button
              onClick={() => addItem(product)}
              className="rounded bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-800 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
