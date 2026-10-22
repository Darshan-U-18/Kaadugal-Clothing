import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({ search: query, limit: 6 });
        setResults(res.products);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.slug || product._id}`);
    onClose();
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B2419] text-[#F7F8F2] rounded-3xl shadow-2xl border border-[#163D2B] overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#163D2B] flex items-center gap-3 bg-[#071910]">
          <Search className="w-5 h-5 text-[#A8BFA5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forest essentials, tees, hoodies, linen, pants..."
            className="w-full bg-transparent text-base text-white placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#A8BFA5] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs uppercase tracking-wider text-[#A8BFA5] bg-[#163D2B] hover:bg-[#386641] hover:text-white rounded-lg transition-colors border border-[#386641]/50"
          >
            ESC
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* Quick Tags when empty */}
          {!query && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FDE68A] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trending Forest Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Forest Oversized T-Shirt',
                  'Essential White Tee',
                  'Sage Relaxed Shirt',
                  'Forest Hoodie',
                  'Organic Cotton',
                  'Little Sprout',
                  'Cyber-Forest',
                  'Linen Dress',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickTag(tag)}
                    className="px-3.5 py-1.5 bg-[#071910] hover:bg-[#163D2B] hover:text-[#FDE68A] border border-[#163D2B] rounded-full text-xs text-[#A8BFA5] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="py-8 text-center text-sm text-[#A8BFA5]">
              Searching the forest archives...
            </div>
          )}

          {/* Results List */}
          {!isLoading && query && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-[#A8BFA5] uppercase tracking-wider mb-2">
                Found {results.length} products
              </div>
              {results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSelectProduct(product)}
                  className="group flex items-center gap-4 p-3 bg-[#071910] hover:bg-[#163D2B]/80 rounded-2xl border border-[#163D2B] cursor-pointer transition-all"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-xl bg-[#0B2419] border border-[#163D2B]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white group-hover:text-[#FDE68A] truncate transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#A8BFA5] truncate">{product.category}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#FDE68A]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#A8BFA5]/60 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A8BFA5] group-hover:text-[#FDE68A] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!isLoading && query && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-white">No essentials found for "{query}"</p>
              <p className="text-xs text-[#A8BFA5] mt-1">Try searching for tees, shirts, hoodies or colors like sage and forest.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
