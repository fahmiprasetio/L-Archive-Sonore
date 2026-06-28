'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Catat error ke console untuk debugging lokal.
    console.error('[App Error]', error);
    // Kirim ke Sentry untuk monitoring produksi.
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="mt-6 font-clash text-2xl font-bold uppercase tracking-wide text-neutral-900">
        Ada yang tidak beres
      </h1>

      <p className="mt-3 max-w-md text-neutral-500">
        Maaf, terjadi kesalahan saat memuat halaman ini. Coba muat ulang — jika masih bermasalah, kembali ke beranda.
      </p>

      {error?.digest && (
        <p className="mt-2 text-xs text-neutral-400">Ref: {error.digest}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <RotateCcw className="h-4 w-4" /> Coba lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          <Home className="h-4 w-4" /> Beranda
        </Link>
      </div>
    </div>
  );
}
