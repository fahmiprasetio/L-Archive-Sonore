'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/products';

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const scrollY = window.scrollY;
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
        style={{
          backgroundImage: "url('/HERO_SECTION.png')",
          aspectRatio: "1280/806",
        }}
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
        <div className="relative z-20 w-full pointer-events-none select-none">
          <img
            src="/transisi_awan_1.png"
            alt="Cloud Transition"
            className="w-full h-auto block"
          />
        </div>

        {/* Section merah — z-10, di belakang awan */}
        <div className="relative z-10 bg-[#441004] w-full text-white pb-[36rem] -mt-[12%]">
          <section id="featured" className="max-w-6xl mx-auto px-6 py-20 space-y-10">
            <div className="border-b border-white/20 pb-6">
              <h2 className="text-3xl font-bold tracking-widest text-white font-clash uppercase">
                Featured Instruments
              </h2>
              <p className="text-sm text-neutral-300 mt-2 font-light tracking-wide uppercase">
                Select items from our active collection
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}