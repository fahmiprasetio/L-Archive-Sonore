'use client';

import { useEffect, useRef, useState } from 'react';

// Aset visual utama yang harus siap sebelum situs ditampilkan.
// Gambar-gambar berat inilah yang selama ini muncul telat sehingga hero
// section terlihat "cacat" (teks dulu muncul, gambar menyusul belakangan).
const HERO_ASSETS = [
  '/HERO_SECTION.png',
  '/transisi_awan_1.png',
  '/logo_title.png',
];

const MIN_DURATION = 1400; // durasi minimum splash tampil (ms) agar animasi sempat terlihat
const SAFETY_TIMEOUT = 6000; // jaring pengaman: jangan pernah menahan user terlalu lama

/**
 * Splash / loading screen.
 *
 * Menutupi seluruh layar saat pertama kali situs dibuka. Progress bar-nya
 * TIDAK lagi diikat langsung ke event asli (yang dulu membuatnya nyangkut di
 * 8% lalu tiba-tiba lompat ke 100%). Sekarang progress dianimasikan mulus
 * lewat requestAnimationFrame: merangkak naik menuju ~90% dengan easing, lalu
 * begitu aset hero + window benar-benar siap ia meluncur mulus ke 100% baru
 * fade-out. Preload gambar hero tetap dilakukan untuk menghangatkan cache.
 */
export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'fading' | 'done'>('loading');
  const startRef = useRef(Date.now());
  const readyRef = useRef(false); // true saat semua aset + window siap

  useEffect(() => {
    // Hanya tampil sekali per sesi browser agar tidak mengganggu saat
    // berpindah halaman atau refresh berulang di sesi yang sama.
    if (sessionStorage.getItem('las-splash-seen')) {
      setPhase('done');
      return;
    }

    let cancelled = false;
    let loaded = 0;
    let windowReady = document.readyState === 'complete';

    const checkReady = () => {
      if (loaded >= HERO_ASSETS.length && windowReady) {
        readyRef.current = true;
      }
    };

    // Preload seluruh gambar hero (menghangatkan cache browser).
    HERO_ASSETS.forEach((src) => {
      const img = new window.Image();
      const done = () => {
        loaded += 1;
        checkReady();
      };
      img.onload = done;
      img.onerror = done; // aset hilang pun jangan sampai menyangkut
      img.src = src;
    });

    const onWindowLoad = () => {
      windowReady = true;
      checkReady();
    };
    if (!windowReady) window.addEventListener('load', onWindowLoad);

    // Jaring pengaman: apa pun kondisinya, splash pasti dilepas.
    const safety = window.setTimeout(() => {
      loaded = HERO_ASSETS.length;
      windowReady = true;
      readyRef.current = true;
    }, SAFETY_TIMEOUT);

    checkReady();

    // ------------------------------------------------------------------
    // Loop animasi progress (mulus, tidak pernah "diam lalu meloncat").
    // ------------------------------------------------------------------
    let raf = 0;
    let current = 0;

    const tick = () => {
      if (cancelled) return;

      const elapsed = Date.now() - startRef.current;
      const minPassed = elapsed >= MIN_DURATION;

      if (readyRef.current && minPassed) {
        // Fase akhir: meluncur mulus ke 100%.
        current += (100 - current) * 0.14 + 0.4;
        if (current >= 99.5) {
          setProgress(100);
          sessionStorage.setItem('las-splash-seen', '1');
          window.setTimeout(() => {
            if (!cancelled) setPhase('fading');
            window.setTimeout(() => {
              if (!cancelled) setPhase('done');
            }, 720);
          }, 260);
          return; // hentikan loop
        }
      } else {
        // Fase memuat: merangkak menuju 90% dengan easing (melambat di ujung).
        const cap = 90;
        current += (cap - current) * 0.018 + 0.25;
        if (current > cap) current = cap;
      }

      setProgress(Math.min(100, Math.round(current)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onWindowLoad);
      window.clearTimeout(safety);
    };
  }, []);

  if (phase === 'done') return null;

  const isFading = phase === 'fading';

  return (
    <div
      aria-hidden={isFading}
      role="status"
      aria-label="Loading L'Archive Sonore"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#441004] transition-opacity duration-700 ease-in-out ${
        isFading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Wordmark dengan animasi masuk fade-up */}
      <div className="splash-fade-up flex select-none flex-col items-center">
        <span className="font-cormorant text-3xl font-light italic leading-none text-white/90 sm:text-4xl">
          L&apos;Archive
        </span>
        <span className="font-clash mt-1 text-4xl font-medium uppercase leading-none tracking-[0.28em] text-white sm:text-5xl">
          Sonore
        </span>
      </div>

      {/* Equalizer bertema audio (animasi terus-menerus) */}
      <div className="mt-9 flex h-8 items-end gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="splash-eq h-full w-1 rounded-full bg-white/70"
            style={{ animationDelay: `${i * 0.14}s`, animationDuration: `${1 + (i % 3) * 0.18}s` }}
          />
        ))}
      </div>

      {/* Progress */}
      <div className="mt-9 flex w-56 flex-col items-center gap-3 sm:w-64">
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
          {/* Shimmer melintas di atas track */}
          <div className="splash-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/50 tabular-nums">
          {progress}%
        </span>
      </div>
    </div>
  );
}
