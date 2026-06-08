import Link from 'next/link';
import { Music, Award, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-6 space-y-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          About L&apos;Archive Sonore
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          The sanctuary for handpicked, premium, and legendary musical instruments curated for true sound artisans.
        </p>
      </div>

      {/* Hero Image / Design */}
      <div className="aspect-[21/9] w-full rounded-lg bg-neutral-900 flex items-center justify-center text-white overflow-hidden relative border border-neutral-800">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1200')" }} />
        <div className="relative z-10 text-center px-4 space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-300">Est. 2026</p>
          <p className="text-2xl font-bold tracking-tight">Preserving the Soul of Sound</p>
        </div>
      </div>

      {/* Main Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">Our Heritage & Mission</h2>
          <p className="text-neutral-600 leading-relaxed">
            At L&apos;Archive Sonore, we believe that musical instruments are not merely tools, but vessels of creativity and history. Our archives are dedicated to collecting and making available the finest musical instruments that carry exceptional tone, craftsmanship, and soul.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            From the resonant vintage wood of acoustic guitars to the precision circuitry of legendary synthesizers, we serve as the bridge between historic audio masterpieces and the modern-day creator.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">Why the Archive?</h2>
          <p className="text-neutral-600 leading-relaxed">
            We hold each piece to an uncompromising standard. Our curators evaluate every guitar, piano, synth, and drum kit to ensure they meet the benchmark of performance and quality that master musicians expect.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            When you acquire a piece from the Archive, you are not just purchasing an instrument—you are inheritng a lineage of musical excellence.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-gray-200 pt-12">
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Music className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-lg">Curated Selection</h3>
          <p className="text-sm text-neutral-600">Only the most historically significant and premium tools make it into our list.</p>
        </div>

        <div className="space-y-3">
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-lg">Elite Quality</h3>
          <p className="text-sm text-neutral-600">Strictly inspected and setup by certified luthiers and audio specialists.</p>
        </div>

        <div className="space-y-3">
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-lg">Secure Custody</h3>
          <p className="text-sm text-neutral-600">Protected checkout systems and global safe transit for every premium item.</p>
        </div>

        <div className="space-y-3">
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-lg">For True Creators</h3>
          <p className="text-sm text-neutral-600">A community built upon mutual passion for music-making, recording, and design.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-white border border-gray-200 p-8 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Begin Your Sound Journey</h2>
        <p className="text-neutral-600 max-w-md mx-auto text-sm">
          Explore our collection and discover the instrument that speaks directly to your artistic expression.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-800 transition text-sm">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
