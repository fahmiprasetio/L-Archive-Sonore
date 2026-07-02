import Link from 'next/link';
import { Music, Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

const heroBg = {
  backgroundImage:
    "url('https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1600')",
};

const storyBg = {
  backgroundImage:
    "url('https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000')",
};

const stats = [
  { value: 'Est. 2026', label: 'Founded' },
  { value: '6+', label: 'Categories' },
  { value: '100%', label: 'Curated & Inspected' },
  { value: 'Global', label: 'Safe Transit' },
];

const values = [
  {
    icon: Music,
    title: 'Curated Selection',
    desc: 'Only the most historically significant and premium instruments make it into our archive.',
  },
  {
    icon: Award,
    title: 'Elite Quality',
    desc: 'Strictly inspected and set up by certified luthiers and audio specialists.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Custody',
    desc: 'Protected checkout and global safe transit for every premium item.',
  },
  {
    icon: Heart,
    title: 'For True Creators',
    desc: 'A community built upon a shared passion for music-making and design.',
  },
];

export default function AboutPage() {
  return (
    <div className="py-6 space-y-16">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800">
        <div className="absolute inset-0 bg-cover bg-center" style={heroBg} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#441004] via-[#441004]/80 to-[#441004]/40" />
        <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-6 py-20 text-center text-white">
          <span className="rounded-full border border-white/30 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
            Est. 2026
          </span>
          <h1 className="mt-6 max-w-3xl font-clash text-4xl font-medium uppercase tracking-wider sm:text-5xl md:text-6xl">
            Preserving the Soul of Sound
          </h1>
          <p className="mt-5 max-w-xl font-cormorant text-2xl font-light italic text-white/90 sm:text-3xl">
            The sanctuary for handpicked, premium, and legendary musical instruments — curated for true sound artisans.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#441004] transition hover:bg-neutral-200"
            >
              Browse Catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <p className="font-clash text-2xl font-bold text-[#441004]">{s.value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* Heritage & Mission */}
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="order-2 space-y-5 lg:order-1">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#441004]">
            Our Heritage
          </span>
          <h2 className="font-clash text-3xl font-medium uppercase tracking-wide text-neutral-900">
            Where instruments find their next chapter
          </h2>
          <p className="leading-relaxed text-neutral-600">
            At L&apos;Archive Sonore, we believe that musical instruments are not merely tools, but vessels of creativity and history. Our archive is dedicated to collecting and offering the finest instruments that carry exceptional tone, craftsmanship, and soul.
          </p>
          <p className="leading-relaxed text-neutral-600">
            From the resonant vintage wood of acoustic guitars to the precision circuitry of legendary synthesizers, we serve as the bridge between historic audio masterpieces and the modern-day creator.
          </p>
        </div>
        <div className="order-1 h-72 w-full overflow-hidden rounded-3xl border border-gray-200 lg:order-2">
          <div className="h-full w-full bg-cover bg-center" style={storyBg} />
        </div>
      </section>

      {/* Values grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="font-clash text-2xl font-medium uppercase tracking-wide text-neutral-900">
            Why the Archive?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
            Every guitar, piano, synth, and drum kit is held to an uncompromising standard.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#441004]/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#441004]/10 text-[#441004] transition group-hover:bg-[#441004] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quote callout */}
      <section className="rounded-3xl bg-[#441004] px-6 py-16 text-center text-white">
        <p className="mx-auto max-w-3xl font-cormorant text-2xl font-light italic leading-snug sm:text-3xl md:text-4xl">
          &ldquo;When you acquire a piece from the Archive, you are not just purchasing an instrument — you are inheriting a lineage of musical excellence.&rdquo;
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="font-clash text-2xl font-medium uppercase tracking-wide text-neutral-900">
          Begin Your Sound Journey
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">
          Explore our collection and discover the instrument that speaks directly to your artistic expression.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#441004] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#300a02]"
        >
          Explore the Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
