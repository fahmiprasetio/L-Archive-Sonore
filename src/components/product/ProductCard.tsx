'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative mb-4 aspect-square w-full rounded bg-gray-100 flex items-center justify-center text-gray-400">
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
      <div className="flex flex-1 flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
        <h3 className="mt-1 font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addItem(product)}
            className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
