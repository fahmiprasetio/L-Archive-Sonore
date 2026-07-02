'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ZoomIn } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/products';
import { toast } from '@/store/toastStore';
import WishlistButton from '@/components/product/WishlistButton';
import ProductReviews from '@/components/product/ProductReviews';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton';
import ImageLightbox from '@/components/product/ImageLightbox';
import type { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ProductWithSpecs = Product & { specs?: string[]; longDescription?: string };

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const products = useProductStore((s) => s.products);
  const loaded = useProductStore((s) => s.loaded);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset gambar aktif saat berpindah produk.
  useEffect(() => {
    setActiveImage(0);
    setLightboxOpen(false);
  }, [id]);

  const product = useMemo<ProductWithSpecs | undefined>(() => {
    const fromStore = products.find((p) => p.id === id);
    const fromMock = MOCK_PRODUCTS.find((p) => p.id === id);
    if (fromStore) {
      return {
        ...fromStore,
        specs: fromMock?.specs,
        longDescription: fromMock?.longDescription,
      };
    }
    return fromMock;
  }, [products, id]);

  // Galeri gambar: pakai product.images bila ada, jika tidak fallback ke image_url.
  const gallery = useMemo<string[]>(() => {
    if (product?.images && product.images.length > 0) return product.images;
    return product?.image_url ? [product.image_url] : [];
  }, [product]);

  // Rekomendasi produk: kategori sama dulu, lalu isi sisanya dari produk lain.
  const relatedProducts = useMemo(() => {
    if (!product) return [] as Product[];
    const pool = products.length > 0 ? products : MOCK_PRODUCTS;
    const sameCategory = pool.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const others = pool.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [products, product]);

  // Hitung ketersediaan stok (null = stok tidak diketahui / tak terbatas).
  const stock = product && typeof product.stock === 'number' ? product.stock : null;
  const inCart = product
    ? items.find((i) => i.product.id === product.id)?.quantity ?? 0
    : 0;
  const soldOut = stock !== null && stock <= 0;
  const maxAddable = stock !== null ? Math.max(0, stock - inCart) : null;
  const maxSelectable = maxAddable === null ? 99 : maxAddable;
  const canAdd = !!product && !soldOut && (maxAddable === null || maxAddable > 0);

  // Jaga agar qty selalu valid ketika ketersediaan berubah.
  useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), Math.max(1, maxSelectable)));
  }, [maxSelectable]);

  if (!product) {
    if (!loaded) {
      return <ProductDetailSkeleton />;
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

  const handleAdd = () => {
    if (!canAdd) return;
    if (maxAddable !== null && qty > maxAddable) {
      toast.error(`Only ${maxAddable} more available for this item`);
      return;
    }
    addItem(product, qty);
    toast.success(`Added ${qty} \u00d7 ${product.name} to cart`);
    setQty(1);
  };

  const activeSrc = gallery[activeImage] ?? gallery[0];

  return (
    <div className="py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            disabled={!activeSrc}
            className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-gray-100 text-gray-400 enabled:cursor-zoom-in"
            aria-label="Perbesar gambar"
          >
            {activeSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeSrc}
                alt={product.name}
                className={`h-full w-full object-cover ${soldOut ? 'opacity-50 grayscale' : ''}`}
              />
            ) : (
              <span>No Image</span>
            )}
            {activeSrc && (
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5" /> Zoom
              </span>
            )}
          </button>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition ${
                    idx === activeImage ? 'border-neutral-900' : 'border-transparent hover:border-gray-300'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
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

            {product.longDescription && (
              <p className="text-neutral-600 leading-relaxed">
                {product.longDescription}
              </p>
            )}

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

          <div className="pt-6 border-t border-gray-100 mt-6 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm text-gray-500">Price</span>
                <p className="text-3xl font-bold text-neutral-900">
                  ${product.price.toLocaleString('en-US')}
                </p>
              </div>
              <div className="text-right">
                {soldOut ? (
                  <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Out of stock
                  </span>
                ) : stock !== null && stock <= 3 ? (
                  <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Only {stock} left
                  </span>
                ) : stock !== null ? (
                  <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {stock} in stock
                  </span>
                ) : null}
                {inCart > 0 && (
                  <p className="mt-1 text-xs text-neutral-500">{inCart} already in cart</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quantity stepper */}
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={!canAdd || qty <= 1}
                  className="flex h-11 w-11 items-center justify-center text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 select-none text-center font-semibold text-neutral-900">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(maxSelectable, q + 1))}
                  disabled={!canAdd || qty >= maxSelectable}
                  className="flex h-11 w-11 items-center justify-center text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`flex-1 rounded px-6 py-3 font-semibold text-white transition ${
                  canAdd
                    ? 'bg-neutral-900 hover:bg-neutral-800'
                    : 'cursor-not-allowed bg-neutral-300 text-neutral-500'
                }`}
              >
                {soldOut ? 'Sold Out' : maxAddable === 0 ? 'Max in cart' : 'Add to Cart'}
              </button>

              <WishlistButton productId={product.id} productName={product.name} variant="button" />
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="pt-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <ProductReviews productId={product.id} productName={product.name} />

      {lightboxOpen && (
        <ImageLightbox
          images={gallery}
          index={activeImage}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActiveImage}
        />
      )}
    </div>
  );
}
