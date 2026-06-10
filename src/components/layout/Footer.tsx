'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const footerOuterRef = useRef<HTMLElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) {
      if (footerContentRef.current) {
        footerContentRef.current.style.transform = '';
      }
      if (cloudRef.current) {
        cloudRef.current.style.transform = '';
      }
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (footerOuterRef.current && footerContentRef.current && cloudRef.current) {
            const rect = footerOuterRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (rect.top < viewportHeight) {
              const scrollY = window.scrollY;
              // Precise calculation of distance from scroll position to maximum scroll
              const maxScroll = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight
              ) - window.innerHeight;

              const distanceToBottom = Math.max(0, maxScroll - scrollY);

              // Parallax logic: translate from 250px down to 0px exactly when reaching the bottom
              const translateY = Math.min(250, distanceToBottom * 0.45);

              footerContentRef.current.style.transform = `translateY(${translateY}px)`;
              cloudRef.current.style.transform = `translateY(${translateY}px)`;
            } else {
              footerContentRef.current.style.transform = 'translateY(250px)';
              cloudRef.current.style.transform = 'translateY(250px)';
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial calls to ensure position is correct
    handleScroll();
    const timeout = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeout);
    };
  }, [isHome]);

  return (
    <footer
      ref={footerOuterRef}
      className={`w-full bg-black text-sage-secondary select-none font-sans relative overflow-visible z-50 ${
        isHome ? '-mt-24' : 'mt-16'
      }`}
    >
      {/* Cloud Transition Asset Wrapper for Parallax (height 0 to avoid blank layout space) */}
      {isHome && (
        <div
          ref={cloudRef}
          className="w-full h-0 relative z-40 transition-transform duration-75 ease-out will-change-transform"
        >
          <div className="absolute top-0 left-0 w-full pointer-events-none select-none -translate-y-[100%]">
            <img
              src="/transisi_awan_3.png"
              alt="Cloud Transition Footer"
              className="w-full h-auto block"
            />
          </div>
        </div>
      )}

      {/* Overflow-hidden wrapper to clip translated content and prevent page height expansion */}
      <div className={isHome ? "w-full overflow-hidden" : "w-full"}>
        {/* Parallax Content Wrapper */}
        <div
          ref={footerContentRef}
          className="w-full transition-transform duration-75 ease-out will-change-transform pb-0"
        >
          {/* Footer Content: pt-24 provides clean spacing under the cloud */}
          <div className={isHome ? "pt-24 pb-6" : "pt-16 pb-8"}>
            {/* Top Section: Info Grid */}
            <div className="mx-auto max-w-[96%] px-4 grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-sage-primary leading-snug uppercase">
                  An e-commerce platform dedicated to premium musical gear, refined aesthetics, and classic sound archiving.
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-sage-primary uppercase tracking-wider">Address</h4>
                <p className="text-sage-secondary/80 leading-relaxed font-light uppercase">
                  Sound Avenue 42,<br />
                  Jakarta, Indonesia
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-sage-primary uppercase tracking-wider">New Projects</h4>
                <p className="text-sage-secondary/80 leading-relaxed font-light uppercase">
                  hello@larchivesonore.com
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-sage-primary uppercase tracking-wider">Call Us</h4>
                <p className="text-sage-secondary/80 leading-relaxed font-light uppercase">
                  +62 812 3456 789
                </p>
              </div>
            </div>

            {/* Dotted Divider */}
            <div className="mx-auto max-w-[96%] px-4 border-t border-dotted border-sage-primary/30 my-6"></div>

            {/* Metadata links row */}
            <div className="mx-auto max-w-[96%] px-4 flex flex-wrap justify-between items-center text-[10px] tracking-widest text-sage-primary/80 uppercase mb-8 gap-4 font-light">
              <span>L&apos;Archive Sonore</span>
              <span>&copy; 2026</span>
              <div className="flex gap-8">
                <span className="hover:text-white cursor-pointer transition">Return Policy</span>
                <span className="hover:text-white cursor-pointer transition">Terms of Use</span>
              </div>
            </div>

            {/* Bottom Image Banner */}
            <div className="mx-auto max-w-[96%]">
              <div className="relative w-full overflow-hidden bg-transparent">
                <img
                  src="/gambar%20footer.png"
                  alt="L'Archive Sonore Footer Background"
                  className="w-full h-auto block opacity-90 brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/10">
                  <h2 className="text-white text-[10.09vw] font-normal tracking-normal text-center uppercase font-clash leading-none whitespace-nowrap scale-y-115 origin-center mt-30 drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                    L&apos;Archive Sonore
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
