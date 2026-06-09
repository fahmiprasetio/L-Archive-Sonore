'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, loading } = useAuthStore();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isVisible, setIsVisible] = useState(true);
  const [isTransparent, setIsTransparent] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check scroll position on mount or pathname change
  useEffect(() => {
    const checkScroll = () => {
      const currentScrollY = window.scrollY;
      if (isHome && currentScrollY <= 50) {
        setIsTransparent(true);
      } else {
        setIsTransparent(false);
      }
    };
    checkScroll();
  }, [isHome]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Transparent logic for homepage
      if (isHome) {
        if (currentScrollY <= 50) {
          setIsTransparent(true);
        } else if (currentScrollY < lastScrollY) {
          setIsTransparent(false);
        }
      } else {
        setIsTransparent(false);
      }

      // Hide/show logic based on scroll direction
      if (currentScrollY <= 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isTransparent
          ? 'bg-transparent border-transparent text-white py-3'
          : 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 text-neutral-900 py-3 shadow-sm'
        }`}
    >
      <div className="mx-auto flex max-w-95vw items-center justify-between px-6">
        <Link
          href="/"
          className={`flex items-center gap-2 text-lg sm:text-xl font-bold tracking-widest font-clash uppercase transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-neutral-900'
            }`}
        >
          L&apos;Archive Sonore
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className={`nav-link-underline font-clash uppercase tracking-wider text-xs md:text-sm font-semibold transition-colors duration-300 ${isTransparent ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
          >
            About
          </Link>

          {!loading && user ? (
            <Link
              href="/profile"
              className={`nav-link-underline flex items-center gap-1.5 font-clash uppercase tracking-wider text-xs md:text-sm font-semibold transition-colors duration-300 ${isTransparent ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          ) : !loading ? (
            <Link
              href="/signin"
              className={`nav-link-underline font-clash uppercase tracking-wider text-xs md:text-sm font-semibold transition-colors duration-300 ${isTransparent ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
            >
              Sign In
            </Link>
          ) : (
            <span className="text-xs md:text-sm text-neutral-400">...</span>
          )}

          <Link
            href="/cart"
            className={`relative flex items-center gap-1 transition-colors duration-300 ${isTransparent ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
          >
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sage-primary text-[10px] font-bold text-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
