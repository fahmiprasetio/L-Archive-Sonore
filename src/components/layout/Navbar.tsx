'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b border-gray-200 bg-neutral-50 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900">
          Timbre
        </Link>
        <Link href="/cart" className="relative flex items-center gap-1 text-neutral-600 hover:text-neutral-900">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
