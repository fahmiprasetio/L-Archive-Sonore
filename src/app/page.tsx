'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/products';

const heroStyle: React.CSSProperties = {
  backgroundImage: "url('/HERO_SECTION.png')",
  aspectRatio: '1280/806',
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (heroRef.current) {
            heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden bg-cover bg-center z-0"
        style={heroStyle}
      >
        <div className="relative z-10 max-w-4xl px-4 sm:px-6 flex flex-col items-center justify-center -mt-[15%]">
          <h1 className="flex flex-col items-center text-center">
            <span className="font-cormorant italic font-light text-white text-3xl sm:text-5xl md:text-6xl lg:text-6xl tracking-normal capitalize drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
              L&apos;Archive
            </span>
            <span className="font-clash font-medium text-white text-7xl sm:text-6xl md:text-7xl lg:text-6xl tracking-normal uppercase mt-2vh sm:mt-[-16px] md:mt-[-20px] lg:mt-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Sonore
            </span>
          </h1>
        </div>
      </section>

      {/* Wrapper: awan + section merah dalam satu stacking context */}
      <div className="relative -mt-[30%]">
        {/* Awan — z-20 supaya di depan section merah */}
        <div className="relative z-20 w-full select-none">
          <img
            src="/transisi_awan_1.png"
            alt="Cloud Transition"
            className="w-full h-auto block pointer-events-none"
          />

          {/* Parallax Overlay on top of Awan 1 */}
          <div
            className="absolute bottom-[10%] left-0 w-full px-12 flex justify-between items-center text-white z-30 font-serif text-[11px] tracking-widest uppercase select-none"
          >
            {/* Left: Socials & Privacy */}
            <div className="flex items-center gap-6">
              <div className="flex gap-4 items-center text-white/80">
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H7v3h2v9h3v-9h2.72l.42-3H12V6.64c0-.88.24-1.48 1.5-1.48H15V2.35C14.73 2.3 13.8 2 12.7 2 10.4 2 8.8 3.4 8.8 6v2z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <a href="/privacy" className="hover:text-neutral-300 transition-colors font-serif tracking-widest">
                Privacy Policy
              </a>
            </div>

            {/* Right: Terms & Waves */}
            <div className="flex items-center gap-8">
              <a href="/terms" className="hover:text-neutral-300 transition-colors font-serif tracking-widest">
                Terms of Service
              </a>
              <div className="flex gap-4 items-center text-white/80">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="3" y="10" width="2" height="10" rx="0.5" />
                  <rect x="8" y="4" width="2" height="16" rx="0.5" />
                  <rect x="13" y="12" width="2" height="8" rx="0.5" />
                  <rect x="18" y="7" width="2" height="13" rx="0.5" />
                </svg>
                <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 15c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0" />
                  <path d="M6 12c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section merah — z-10, di belakang awan */}
        <div className="relative z-10 bg-[#441004] w-full text-white pb-[36rem] -mt-[12%]">
          {/* Brand Intro Callout Section */}
          <div className="max-w-4xl mx-auto px-6 pt-64 pb-24 text-center flex flex-col items-center justify-center space-y-8 select-none">
            <h2 className="font-clash font-medium text-white text-3xl sm:text-4xl md:text-5xl uppercase tracking-widest leading-none">
              L&apos;Archive Sonore
            </h2>
            <p className="font-cormorant italic font-light text-white text-3xl sm:text-4xl md:text-5xl max-w-[28rem] sm:max-w-[36rem] md:max-w-[46rem] leading-tight select-text">
              where timeless instruments find their next definitive chapter.
            </p>
            <a
              href="#featured"
              className="inline-block mt-4 px-8 py-3 border border-white/20 hover:border-white rounded-full text-[9px] tracking-widest uppercase text-white/90 hover:text-white transition duration-300 font-sans"
            >
              Explore Instruments
            </a>
          </div>

          <section id="featured" className="max-w-6xl mx-auto px-6 pt-16 pb-20 space-y-10">
            <div className="border-b border-white/20 pb-6">
              <h2 className="text-3xl font-bold tracking-widest text-white font-clash uppercase">
                Featured Instruments
              </h2>
              <p className="text-sm text-neutral-300 mt-2 font-light tracking-wide uppercase">
                Select items from our active collection
              </p>
            </div>

            {/* Carousel — scroll ke samping, hanya 5 barang */}
            <div className="-mx-6 px-6 overflow-x-auto pb-4 [scrollbar-width:thin]">
              <div className="flex gap-6 snap-x snap-mandatory">
                {MOCK_PRODUCTS.slice(0, 5).map((product) => (
                  <div key={product.id} className="snap-start shrink-0 w-72">
                    <ProductCard product={product} dark />
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol ke halaman shop (semua barang) */}
            <div className="flex justify-center pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-10 py-3 text-[10px] tracking-widest uppercase text-white/90 hover:bg-white hover:text-[#441004] transition duration-300 font-sans"
              >
                View All Instruments &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
