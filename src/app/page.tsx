import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gibson Les Paul Standard',
    description: 'The legendary solid-body electric guitar with dual humbuckers and mahogany construction.',
    price: 2499,
    image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=400',
    category: 'Guitar',
  },
  {
    id: '2',
    name: 'Yamaha U1 Upright Piano',
    description: 'A perennial favorite among discerning pianists, offering outstanding musical performance.',
    price: 8999,
    image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=400',
    category: 'Piano',
  },
  {
    id: '3',
    name: 'Roland TD-17KVX V-Drums',
    description: 'Electronic drum kit with premium snare, hi-hat, and cymbals for professional practice.',
    price: 1699,
    image_url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=400',
    category: 'Drums',
  },
  {
    id: '4',
    name: 'Fender Jazz Bass Professional',
    description: 'The industry-standard electric bass, known for its punchy sound and ergonomic neck.',
    price: 1799,
    image_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ec52744?auto=format&fit=crop&q=80&w=400',
    category: 'Bass',
  },
  {
    id: '5',
    name: 'Stradivarius Replica Violin',
    description: 'Handcrafted spruce and maple violin offering warm, resonant projection.',
    price: 1250,
    image_url: 'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?auto=format&fit=crop&q=80&w=400',
    category: 'Violin',
  },
  {
    id: '6',
    name: 'Moog Subsequent 37 Synthesizer',
    description: 'Analog synthesizer with duo-phonic capabilities, multidrive, and advanced controls.',
    price: 1899,
    image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400',
    category: 'Synthesizer',
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/HERO_SECTION.png')", aspectRatio: "1280/806" }}
      >
        {/* Content */}
        <div className="relative z-10 max-w-4xl px-4 sm:px-6 flex flex-col items-center justify-center mt-15">

          <h1 className="flex flex-col items-center text-center">
            <span className="font-cormorant italic font-light text-white text-3xl sm:text-5xl md:text-6xl lg:text-6xl tracking-normal capitalize drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
              L&apos;Archive
            </span>
            <span className="font-clash font-medium text-white text-7xl sm:text-6xl md:text-7xl lg:text-6xl tracking-normal uppercase mt-2vh sm:mt-[-16px] md:mt-[-20px] lg:mt-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Sonore
            </span>
          </h1>

          {/* Elegant thin long down arrow scroll indicator */}
          <div className="pt-8 sm:pt-14 md:pt-20 flex justify-center">
            <svg
              className="w-8 sm:w-10 h-32 sm:h-48 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 48"
              strokeWidth="0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v44m0 0l-6-6m6 6l6-6" />
            </svg>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="featured" className="max-w-6xl mx-auto px-6 py-20 space-y-10">
        <div className="border-b border-neutral-200 pb-6">
          <h2 className="text-3xl font-bold tracking-widest text-neutral-900 font-clash uppercase">
            Featured Instruments
          </h2>
          <p className="text-sm text-neutral-600 mt-2 font-light tracking-wide uppercase">
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
  );
}
