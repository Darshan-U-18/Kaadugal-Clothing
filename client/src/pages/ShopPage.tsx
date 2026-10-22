import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, RotateCcw, ChevronRight, Tag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../services/api';
import { CATEGORY_TAXONOMY } from '../data/categoryTaxonomy';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter States from URL or defaults
  const currentCategory = searchParams.get('category') || 'all';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const currentType = searchParams.get('type') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSearch = searchParams.get('search') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 5000;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams: Record<string, any> = {
          sort: currentSort,
          limit: 200,
        };

        if (currentCategory && currentCategory !== 'all') {
          queryParams.category = currentCategory;
        }
        if (currentSubcategory) queryParams.subcategory = currentSubcategory;
        if (currentType) queryParams.type = currentType;
        if (currentSize) queryParams.size = currentSize;
        if (currentColor) queryParams.color = currentColor;
        if (currentSearch) queryParams.search = currentSearch;
        if (currentInStock) queryParams.inStock = 'true';
        if (currentMaxPrice < 5000) queryParams.maxPrice = currentMaxPrice;

        const res = await api.getProducts(queryParams);
        setProducts(res.products);
      } catch (err) {
        console.error('Failed to fetch shop products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentCategory,
    currentSubcategory,
    currentType,
    currentSize,
    currentColor,
    currentSort,
    currentSearch,
    currentInStock,
    currentMaxPrice,
  ]);

  const updateFilter = (key: string, val: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val || val === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, val);
    }
    setSearchParams(newParams);
  };

  const selectCategory = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val || val === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', val);
    }
    newParams.delete('subcategory');
    newParams.delete('type');
    setSearchParams(newParams);
  };

  const selectSubcategory = (subVal: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!subVal || subVal === 'all') {
      newParams.delete('subcategory');
    } else {
      newParams.set('subcategory', subVal);
    }
    newParams.delete('type');
    setSearchParams(newParams);
  };

  const selectType = (typeVal: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!typeVal) {
      newParams.delete('type');
    } else {
      newParams.set('type', typeVal);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const categories = [
    { label: 'All Items', value: 'all' },
    { label: 'Mens', value: 'Mens' },
    { label: 'Womens', value: 'Womens' },
    { label: 'Kids', value: 'Kids' },
    { label: 'GenZ', value: 'GenZ' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const colors = [
    { name: 'Forest Green', hex: '#163D2B' },
    { name: 'Deep Forest', hex: '#0B2419' },
    { name: 'Sage Green', hex: '#A8BFA5' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Cream White', hex: '#F7F8F2' },
    { name: 'Charcoal Black', hex: '#202820' },
  ];

  const hasActiveFilters =
    (currentCategory && currentCategory !== 'all') ||
    currentSubcategory ||
    currentType ||
    currentSize ||
    currentColor ||
    currentSearch ||
    currentInStock ||
    currentMaxPrice < 4000;

  const activeTaxonomy =
    currentCategory && currentCategory !== 'all'
      ? CATEGORY_TAXONOMY[currentCategory.toLowerCase()]
      : null;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      {/* Editorial Forest Banner */}
      <div className="bg-[#0B2419] text-white py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-[#163D2B]">
        <div className="max-w-7xl mx-auto text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-semibold block mb-2">
              The Living Collection
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {currentCategory && currentCategory !== 'all'
                ? `${currentCategory} Clothing`
                : 'Forest-Inspired Essentials'}
            </h1>
            <p className="text-sm text-[#A8BFA5] font-light mt-2 max-w-xl">
              {activeTaxonomy
                ? activeTaxonomy.subtitle
                : 'Heavyweight organic cotton, breathable Belgian flax linen, and natural botanical dyes crafted for every generation.'}
            </p>
          </div>
          <div className="text-xs text-[#A8BFA5] font-mono tracking-wider bg-[#071910] px-4 py-2 rounded-xl border border-[#163D2B]">
            Showing <span className="text-[#FDE68A] font-bold">{products.length}</span> handcrafted garments
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Filter and Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#163D2B]">
          {/* Category Tabs (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => {
              const active =
                cat.value === 'all'
                  ? !currentCategory || currentCategory === 'all'
                  : currentCategory.toLowerCase() === cat.value.toLowerCase() ||
                  (cat.value === 'Mens' && currentCategory.toLowerCase().includes('men') && !currentCategory.toLowerCase().includes('women')) ||
                  (cat.value === 'Womens' && currentCategory.toLowerCase().includes('women')) ||
                  (cat.value === 'Kids' && currentCategory.toLowerCase().includes('kid')) ||
                  (cat.value === 'GenZ' && (currentCategory.toLowerCase().includes('gen') || currentCategory.toLowerCase().includes('streetwear')));

              return (
                <button
                  key={cat.value}
                  onClick={() => selectCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 whitespace-nowrap ${active
                      ? 'bg-[#163D2B] text-[#FDE68A] shadow-md border border-[#386641] font-bold shadow-[0_0_12px_rgba(56,102,65,0.3)]'
                      : 'bg-[#0B2419] hover:bg-[#163D2B]/60 text-[#F7F8F2] border border-[#163D2B] hover:border-[#386641]/50 hover:scale-105'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B2419] border border-[#163D2B] rounded-xl text-xs font-semibold text-[#F7F8F2] hover:bg-[#163D2B] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#A8BFA5]" />
            <span>Filters & Categories</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#FDE68A]" />
            )}
          </button>

          {/* Sort & Search Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A8BFA5]" />
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-9 pr-3 py-2 bg-[#0B2419] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-gray-400 focus:outline-none focus:border-[#386641] transition-all"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-3 py-2 bg-[#0B2419] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-[#386641] font-medium transition-all"
            >
              <option value="featured" className="bg-[#0B2419] text-white">Featured First</option>
              <option value="newest" className="bg-[#0B2419] text-white">New Arrivals</option>
              <option value="price-asc" className="bg-[#0B2419] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#0B2419] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#0B2419] text-white">Highest Customer Rated</option>
            </select>
          </div>
        </div>



        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 mb-6 text-xs animate-fade-in">
            <span className="text-[#A8BFA5] font-medium mr-1">Active filters:</span>
            {currentCategory && currentCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B2419] border border-[#163D2B] rounded-full text-[#F7F8F2]">
                Category: <strong className="text-[#FDE68A]">{currentCategory}</strong>
                <button onClick={() => selectCategory('all')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSubcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163D2B] border border-[#386641] rounded-full text-[#F7F8F2]">
                Section: <strong className="text-white">{currentSubcategory}</strong>
                <button onClick={() => selectSubcategory(null)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#386641] border border-emerald-400/50 rounded-full text-white shadow-sm">
                Style: <strong className="text-white">{currentType}</strong>
                <button onClick={() => selectType(null)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSize && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B2419] border border-[#163D2B] rounded-full text-[#F7F8F2]">
                Size: <strong className="text-[#FDE68A]">{currentSize}</strong>
                <button onClick={() => updateFilter('size', null)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentColor && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B2419] border border-[#163D2B] rounded-full text-[#F7F8F2]">
                Color: <strong className="text-[#FDE68A]">{currentColor}</strong>
                <button onClick={() => updateFilter('color', null)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentMaxPrice < 5000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B2419] border border-[#163D2B] rounded-full text-[#F7F8F2]">
                Under ₹{currentMaxPrice.toLocaleString('en-IN')}
                <button onClick={() => updateFilter('maxPrice', null)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B2419] border border-[#163D2B] rounded-full text-[#F7F8F2]">
                In Stock Only
                <button onClick={() => updateFilter('inStock', null)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 ml-2 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          </div>
        )}

        {/* Catalog Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B] shadow-xl h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#163D2B]">
              <h3 className="font-editorial text-xl text-white">Refine By</h3>
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#A8BFA5] hover:text-[#FDE68A] transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-3">
                Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateFilter('size', currentSize === sz ? null : sz)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all duration-300 ${currentSize === sz
                        ? 'bg-[#163D2B] text-[#FDE68A] border-[#386641] shadow-md'
                        : 'bg-[#071910] hover:bg-[#163D2B]/50 text-[#F7F8F2] border-[#163D2B]'
                      }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="pt-4 border-t border-[#163D2B]">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-3">
                Earth Palette
              </label>
              <div className="space-y-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => updateFilter('color', currentColor === c.name ? null : c.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors duration-300 ${currentColor === c.name
                        ? 'bg-[#163D2B] font-bold text-[#FDE68A] border border-[#386641]/50'
                        : 'hover:bg-[#163D2B]/40 text-[#F7F8F2]'
                      }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-[#163D2B]">
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="uppercase tracking-wider font-semibold text-[#A8BFA5]">
                  Max Price
                </label>
                <span className="font-bold text-[#FDE68A]">
                  ₹{currentMaxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={currentMaxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full accent-[#386641] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A8BFA5] mt-1">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-[#163D2B] flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F7F8F2] cursor-pointer">
                In Stock Only
              </label>
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                className="w-4 h-4 rounded text-[#386641] focus:ring-[#386641] accent-[#386641] cursor-pointer"
              />
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-[#0B2419] border border-[#163D2B] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-[#0B2419] rounded-2xl p-12 text-center border border-[#163D2B]">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#163D2B] flex items-center justify-center text-[#A8BFA5] mb-4">
                  <Filter className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-editorial text-2xl text-white">No Garments Matched</h4>
                <p className="text-xs text-[#A8BFA5] max-w-sm mx-auto mt-2 mb-6">
                  Try broadening your filters or resetting the category to explore other forest pieces.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#0B2419] text-[#F7F8F2] border-l border-[#163D2B] h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#163D2B]">
                <h3 className="font-editorial text-2xl text-white">Filter Catalog</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#A8BFA5] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2">
                  Category
                </label>
                <div className="flex flex-col gap-1.5">
                  {categories.map((c) => {
                    const active =
                      c.value === 'all'
                        ? !currentCategory || currentCategory === 'all'
                        : currentCategory.toLowerCase() === c.value.toLowerCase() ||
                        (c.value === 'Mens' && currentCategory.toLowerCase().includes('men') && !currentCategory.toLowerCase().includes('women')) ||
                        (c.value === 'Womens' && currentCategory.toLowerCase().includes('women')) ||
                        (c.value === 'Kids' && currentCategory.toLowerCase().includes('kid')) ||
                        (c.value === 'GenZ' && (currentCategory.toLowerCase().includes('gen') || currentCategory.toLowerCase().includes('streetwear')));

                    return (
                      <button
                        key={c.value}
                        onClick={() => {
                          selectCategory(c.value);
                          setMobileFilterOpen(false);
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${active
                            ? 'bg-[#163D2B] text-[#FDE68A] font-bold border border-[#386641]'
                            : 'bg-[#071910] text-[#F7F8F2] hover:bg-[#163D2B]/50'
                          }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>


              </div>

              {/* Size */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateFilter('size', currentSize === sz ? null : sz)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${currentSize === sz
                          ? 'bg-[#163D2B] text-[#FDE68A] border-[#386641]'
                          : 'bg-[#071910] text-[#F7F8F2] border-[#163D2B]'
                        }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
