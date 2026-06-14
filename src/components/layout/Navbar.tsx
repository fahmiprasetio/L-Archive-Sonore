'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // check initial scroll position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ease-in-out ${isScrolled
        ? 'top-4 left-6 w-[20rem] max-w-[calc(100vw-3rem)] rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 py-2.5 px-5 shadow-xl text-white'
        : isOpen
          ? 'top-0 left-0 w-full bg-black/5 backdrop-blur-md border-b border-white/10 py-5 px-6 text-white'
          : 'top-0 left-0 w-full bg-transparent border-transparent py-5 text-current'
        }`}
    >
      <div
        className={`flex items-center justify-between w-full transition-all duration-500 ${isScrolled ? '' : 'mx-auto max-w-[95%] px-6'
          }`}
      >
        {/* Title */}
        <Link
          href="/"
          className={`font-bold tracking-widest font-clash uppercase transition-all duration-300 whitespace-nowrap ${isScrolled
            ? 'text-white text-sm sm:text-base hover:opacity-85'
            : 'text-white text-lg sm:text-xl hover:text-white/80'
            }`}
        >
          L&apos;Archive Sonore
        </Link>

        {/* Hamburger Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex flex-col justify-center items-end gap-1.5 w-8 h-8 cursor-pointer focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 bg-white transition-all duration-300 ease-out ${isOpen ? 'w-5 rotate-45 translate-y-[4px]' : 'w-5'}`}
          ></span>
          <span
            className={`h-0.5 bg-white transition-all duration-300 ease-out ${isOpen ? 'w-5 -rotate-45 -translate-y-[4px]' : 'w-3'}`}
          ></span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="mt-3.5 border-t border-white/10 flex flex-col pt-1.5 gap-0.5 animate-in fade-in slide-in-from-top-2 duration-300 w-full"
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`group flex items-center justify-between py-2.5 border-b border-white/5 transition-all duration-300 ${isActive
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-white'
                  }`}
              >
                <span className="font-clash text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300">
                  {item.name}
                </span>
                <span
                  className="h-0.5 bg-white transition-all duration-300 ease-out w-0 group-hover:w-50"
                ></span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
