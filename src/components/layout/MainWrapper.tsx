'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <main className={`flex-grow ${isHome ? 'w-full' : 'mx-auto w-full max-w-6xl p-6 pt-20'}`}>
      {children}
    </main>
  );
}
