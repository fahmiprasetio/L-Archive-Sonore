'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function AuthInitializer() {
  const init = useAuthStore((state) => state.init);
  const user = useAuthStore((state) => state.user);
  const loadWishlist = useWishlistStore((state) => state.load);

  useEffect(() => {
    init();
  }, [init]);

  // Muat ulang wishlist setiap kali status login berubah (login/logout).
  useEffect(() => {
    loadWishlist();
  }, [user, loadWishlist]);

  return null;
}
