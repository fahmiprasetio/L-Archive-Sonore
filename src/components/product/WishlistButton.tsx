'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from '@/store/toastStore';

interface Props {
  productId: string;
  productName?: string;
  variant?: 'overlay' | 'button';
}

export default function WishlistButton({ productId, productName, variant = 'overlay' }: Props) {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const saved = mounted && ids.includes(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasSaved = ids.includes(productId);
    toggle(productId);
    if (wasSaved) toast.info(`${productName || 'Item'} removed from wishlist`);
    else toast.success(`${productName || 'Item'} saved to wishlist`);
  };

  const base = 'inline-flex items-center justify-center transition';
  const cls =
    variant === 'overlay'
      ? `${base} h-9 w-9 rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur hover:bg-white`
      : `${base} h-11 w-11 rounded-lg border border-gray-300 text-neutral-700 hover:bg-neutral-50`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cls}
    >
      <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
    </button>
  );
}
