'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  dark?: boolean;
}

export default function ProductCard({ product, dark = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div
      className={`flex flex-col rounded-lg border p-4 shadow-sm transition ${
        dark
          ? 'border-white/10 bg-black/20 backdrop-blur-md'
          : 'border-gray-200 bg-white'
      }`}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div
          className={`relative mb-4 aspect-square w-full rounded flex items-center justify-center hover:opacity-90 transition overflow-hidden ${
            dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col">
        <span className={`text-xs uppercase tracking-wider ${dark ? 'text-white/50' : 'text-gray-500'}`}>{product.category}</span>
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className={`mt-1 font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
        </Link>
        <p className={`mt-1 flex-1 text-sm line-clamp-2 ${dark ? 'text-white/60' : 'text-gray-600'}`}>{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            ${product.price.toLocaleString('en-US')}
          </span>
          <button
            onClick={() => addItem(product)}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition duration-200 ${
              dark
                ? 'bg-[#EFE6D3] text-[#441004] hover:bg-[#E5D8BD]'
                : 'bg-sage-primary text-white hover:bg-sage-secondary'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
