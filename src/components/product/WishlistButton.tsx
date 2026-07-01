'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/store/toastStore';

const dbMode = isSupabaseConfigured();

interface Props {
  productId: string;
  productName?: string;
  variant?: 'overlay' | 'button' | 'inline';
  dark?: boolean;
}

export default function WishlistButton({ productId, productName, variant = 'overlay', dark = false }: Props) {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => setMounted(true), []);

  const saved = mounted && ids.includes(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dbMode && !user) {
      toast.info('Sign in to save items to your wishlist');
      router.push('/signin');
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const nowSaved = await toggle(productId);
      if (nowSaved) toast.success(`${productName || 'Item'} saved to wishlist`);
      else toast.info(`${productName || 'Item'} removed from wishlist`);
    } catch {
      toast.error('Failed to update wishlist. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const base = 'inline-flex items-center justify-center transition disabled:opacity-60';
  const cls =
    variant === 'overlay'
      ? `${base} h-9 w-9 rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur hover:bg-white`
      : variant === 'inline'
      ? `${base} h-8 w-8 shrink-0 rounded-full ${dark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`
      : `${base} h-11 w-11 rounded-lg border border-gray-300 text-neutral-700 hover:bg-neutral-50`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cls}
    >
      <Bookmark className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
