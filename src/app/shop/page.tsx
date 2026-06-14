'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, X, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState('default');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get dynamic categories and counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return {
      categories: Object.keys(counts).sort(),
      categoryCounts: counts,
    };
  }, []);

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const matchesMinPrice = minPrice === '' || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === '' || product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [searchQuery, selectedCategories, minPrice, maxPrice]);

  // Sort products logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'name-asc') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'name-desc') {
      return list.sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategories.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'default';

  return (
    <div className="relative w-full min-h-screen py-8 text-white">
      {/* Full-bleed red background to match the homepage */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-[#441004]" />

      {/* Hero section (taller — siap untuk gambar/aset overlay) */}
      <div className="relative mb-10 flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#441004] px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white uppercase font-clash">
          The Archive Shop
        </h1>
        <p className="text-sm text-white/70 mt-4 font-light tracking-wide uppercase">
          Browse our complete inventory of professional and historical instruments
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar (hidden on mobile/tablet, shown on lg screens) */}
        <aside className="hidden lg:block w-80 flex-shrink-0 bg-white border border-neutral-200/80 rounded-xl p-6 shadow-sm sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-clash text-lg font-semibold tracking-wider text-neutral-900 uppercase flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-sage-primary" />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs flex items-center gap-1 text-neutral-500 hover:text-neutral-950 transition font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h3 className="font-clash text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3.5">
              Categories
            </h3>
            <div className="space-y-2.5">
              {categories.map((category) => {
                const isChecked = selectedCategories.includes(category);
                return (
                  <label
                    key={category}
                    className="flex items-center justify-between group cursor-pointer text-sm text-neutral-600 hover:text-neutral-950 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-neutral-300 text-sage-primary focus:ring-sage-secondary cursor-pointer accent-sage-primary"
                      />
                      <span className={isChecked ? 'font-medium text-neutral-950' : ''}>
                        {category}
                      </span>
                    </div>
                    <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-700 transition">
                      {categoryCounts[category]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-clash text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3.5">
              Price Range ($)
            </h3>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-xs py-2 pl-6 pr-2 border border-neutral-200 rounded bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage-primary text-neutral-900 transition"
                />
              </div>
              <span className="text-neutral-400 text-sm">—</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-xs py-2 pl-6 pr-2 border border-neutral-200 rounded bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage-primary text-neutral-900 transition"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Toggle and Panel (shown on mobile/tablet) */}
        <div className="w-full lg:hidden flex flex-col gap-4">
          <div className="flex gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-200 rounded-lg bg-white text-sm font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-sage-primary" />
              <span>{isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}</span>
              {selectedCategories.length > 0 && (
                <span className="ml-1 bg-sage-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {/* Clear filters shortcut */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center justify-center gap-1.5 px-4 border border-transparent rounded-lg text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Mobile Filters Accordion Panel */}
          {isMobileFiltersOpen && (
            <div className="w-full bg-white border border-neutral-200/80 rounded-xl p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-4 duration-200">
              {/* Category selector */}
              <div>
                <h3 className="font-clash text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isChecked = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`text-xs py-1.5 px-3 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? 'bg-sage-primary/10 border-sage-primary text-sage-primary font-semibold'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100'
                        }`}
                      >
                        {category}
                        <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${isChecked ? 'bg-sage-primary/20 text-sage-primary' : 'bg-neutral-200 text-neutral-500'}`}>
                          {categoryCounts[category]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-clash text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                  Price Range ($)
                </h3>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-xs py-2.5 pl-6 pr-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage-primary text-neutral-900 transition"
                    />
                  </div>
                  <span className="text-neutral-400 text-sm">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-xs py-2.5 pl-6 pr-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage-primary text-neutral-900 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shop Main Products Display Column */}
        <div className="flex-grow w-full">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6 bg-white border border-neutral-200/80 rounded-xl p-4 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm py-2 px-10 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage-primary text-neutral-900 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs py-2.5 pl-12 pr-8 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage-primary text-neutral-900 appearance-none font-semibold cursor-pointer text-right transition"
              >
                <option value="default">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Results count & current filters summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">
              Showing <span className="text-white font-bold">{sortedProducts.length}</span> of {PRODUCTS.length} Instruments
            </p>

            {/* Selected category tags if any */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mr-1">Active:</span>
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 pl-2 pr-1.5 py-0.5 rounded-full"
                  >
                    {cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="hover:text-white/70 transition cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Product Grid - Maximum 3 items per row */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} dark />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-sm px-6">
              <SlidersHorizontal className="h-12 w-12 text-white/30 mb-4" />
              <h3 className="font-clash text-lg font-semibold text-white uppercase tracking-wider">
                No Instruments Found
              </h3>
              <p className="text-sm text-white/60 mt-2 max-w-sm">
                We couldn&apos;t find any instruments matching your active filters. Try adjusting your search query, categories, or price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#EFE6D3] text-[#441004] rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-[#E5D8BD] transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
