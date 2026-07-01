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

const MIN_DURATION = 1200; // durasi minimum splash tampil (ms) agar tidak berkedip
const SAFETY_TIMEOUT = 6000; // jaring pengaman: jangan pernah menahan user terlalu lama

/**
 * Splash / loading screen.
 *
 * Menutupi seluruh layar saat pertama kali situs dibuka, menampilkan progress
 * sambil melakukan preload gambar hero. Preload ini menghangatkan cache browser
 * sehingga ketika hero section dirender, gambarnya langsung muncul dan situs
 * tidak lagi terlihat setengah jadi (hanya teks tanpa visual).
 */
export default function SplashScreen() {
  const [progress, setProgress] = useState(8);
  const [phase, setPhase] = useState<'loading' | 'fading' | 'done'>('loading');
  const startRef = useRef(Date.now());
  const finishedRef = useRef(false);

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

    const maybeFinish = () => {
      if (finishedRef.current) return;
      if (loaded < HERO_ASSETS.length || !windowReady) return;

      finishedRef.current = true;
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, MIN_DURATION - elapsed);

      window.setTimeout(() => {
        if (cancelled) return;
        setProgress(100);
        window.setTimeout(() => {
          if (cancelled) return;
          sessionStorage.setItem('las-splash-seen', '1');
          setPhase('fading');
          // Selaras dengan durasi transisi fade (duration-500).
          window.setTimeout(() => {
            if (!cancelled) setPhase('done');
          }, 550);
        }, 220);
      }, wait);
    };

    const update = () => {
      const imgRatio = loaded / HERO_ASSETS.length;
      // Bobot progress: 70% dari gambar hero, 30% dari kesiapan window.
      const pct = Math.min(99, Math.round(imgRatio * 70 + (windowReady ? 30 : 0)));
      if (!cancelled) setProgress((prev) => Math.max(prev, pct));
      maybeFinish();
    };

    // Preload seluruh gambar hero.
    HERO_ASSETS.forEach((src) => {
      const img = new window.Image();
      const done = () => {
        loaded += 1;
        update();
      };
      img.onload = done;
      img.onerror = done; // aset hilang pun jangan sampai menyangkut
      img.src = src;
    });

    const onWindowLoad = () => {
      windowReady = true;
      update();
    };
    if (!windowReady) window.addEventListener('load', onWindowLoad);

    // Jaring pengaman: apa pun kondisinya, splash pasti hilang.
    const safety = window.setTimeout(() => {
      windowReady = true;
      loaded = HERO_ASSETS.length;
      update();
    }, SAFETY_TIMEOUT);

    update();

    return () => {
      cancelled = true;
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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#441004] transition-opacity duration-500 ease-in-out ${
        isFading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Wordmark */}
      <div className="flex select-none flex-col items-center">
        <span className="font-cormorant text-3xl font-light italic leading-none text-white/90 sm:text-4xl">
          L&apos;Archive
        </span>
        <span className="font-clash mt-1 text-4xl font-medium uppercase leading-none tracking-[0.28em] text-white sm:text-5xl">
          Sonore
        </span>
      </div>

      {/* Progress */}
      <div className="mt-10 flex w-56 flex-col items-center gap-3 sm:w-64">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/50">
          {progress}%
        </span>
      </div>
    </div>
  );
}
