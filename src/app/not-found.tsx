import Link from 'next/link';
import { Home, Music } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-primary/10 text-sage-primary">
        <Music className="h-8 w-8" />
      </div>

      <p className="mt-6 font-clash text-[6rem] font-bold leading-none tracking-tight text-sage-primary sm:text-[8rem]">
        404
      </p>

      <h1 className="mt-2 font-clash text-2xl font-bold uppercase tracking-wide text-neutral-900">
        Halaman tidak ditemukan
      </h1>

      <p className="mt-3 max-w-md text-neutral-500">
        Sepertinya nada yang kamu cari sudah berpindah tempat. Mari kembali ke awal dan temukan instrumen favoritmu.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          Jelajahi Koleksi
        </Link>
      </div>
    </div>
  );
}
