'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // Halaman yang mengatur layout & padding-nya sendiri (full-width).
  const isFullWidth = isHome || pathname === '/shop';

  return (
    <main className={`flex-grow ${isFullWidth ? 'w-full' : 'mx-auto w-full max-w-6xl p-6 pt-20'}`}>
      {children}
    </main>
  );
}
