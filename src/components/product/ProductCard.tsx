'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import WishlistButton from '@/components/product/WishlistButton';

interface ProductCardProps {
  product: Product;
  dark?: boolean;
}

export default function ProductCard({ product, dark = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const soldOut = typeof product.stock === 'number' && product.stock <= 0;
  const lowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= 3;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border shadow-sm transition ${
        dark
          ? 'border-white/10 bg-black/20 backdrop-blur-md'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Gambar: padding tipis (p-2) supaya gambar terasa lebih luas di dalam kartu */}
      <Link href={`/products/${product.id}`} className="block p-2">
        <div
          className={`relative aspect-square w-full overflow-hidden rounded flex items-center justify-center transition hover:opacity-90 ${
            dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className={`h-full w-full object-cover rounded ${soldOut ? 'opacity-50 grayscale' : ''}`}
            />
          ) : (
            <span>No Image</span>
          )}
          {soldOut && (
            <span className="absolute top-2 left-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Sold Out
            </span>
          )}
          {!soldOut && lowStock && (
            <span className="absolute top-2 left-2 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {product.stock} left
            </span>
          )}
        </div>
      </Link>
      {/* Teks: padding tetap (px-4 pb-4) seperti sebelumnya */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
        <span className={`text-xs uppercase tracking-wider ${dark ? 'text-white/50' : 'text-gray-500'}`}>{product.category}</span>
        {/* Judul + tombol wishlist sebaris; wishlist di kanan judul */}
        <div className="mt-1 flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
          </Link>
          <WishlistButton productId={product.id} productName={product.name} variant="inline" dark={dark} />
        </div>
        <p className={`mt-1 flex-1 text-sm line-clamp-2 ${dark ? 'text-white/60' : 'text-gray-600'}`}>{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            ${product.price.toLocaleString('en-US')}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={soldOut}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition duration-200 ${
              soldOut
                ? 'cursor-not-allowed bg-neutral-300 text-neutral-500'
                : dark
                ? 'bg-[#EFE6D3] text-[#441004] hover:bg-[#E5D8BD]'
                : 'bg-sage-primary text-white hover:bg-sage-secondary'
            }`}
          >
            {soldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
