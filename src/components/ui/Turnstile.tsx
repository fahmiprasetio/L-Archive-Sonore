'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

// Site key publik Cloudflare Turnstile. Bila kosong, widget TIDAK dirender dan
// captcha dianggap nonaktif (opsional) — form tetap berfungsi normal.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

// Dipakai halaman untuk tahu apakah captcha aktif (mis. mewajibkan token).
export const isCaptchaConfigured = (): boolean => SITE_KEY.trim() !== '';

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileProps {
  // Dipanggil dengan token saat verifikasi berhasil, atau '' saat expired/error.
  onToken: (token: string) => void;
  className?: string;
}

export default function Turnstile({ onToken, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!SITE_KEY || !containerRef.current || !window.turnstile) return;
    if (widgetId.current) return; // sudah dirender
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: (token: string) => onToken(token),
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
    });
  }, [onToken]);

  // Bila script sudah termuat sebelumnya (navigasi antar halaman).
  useEffect(() => {
    if (typeof window !== 'undefined' && window.turnstile) setReady(true);
  }, []);

  useEffect(() => {
    if (ready) renderWidget();
  }, [ready, renderWidget]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
      />
      <div ref={containerRef} className={className} />
    </>
  );
}
