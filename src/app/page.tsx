import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/products';

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
