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
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <section className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          L&apos;Archive Sonore Premium Instruments
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-600">
          Discover handpicked, world-class musical gear crafted for true artisans and creators.
        </p>
      </section>

      {/* Catalog Grid */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-6">
          Featured Instruments
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
