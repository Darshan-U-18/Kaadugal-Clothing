import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryTaxonomy } from '../data/categoryTaxonomy';

interface MegaMenuProps {
  category: CategoryTaxonomy;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  category,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 w-full z-50 pt-2 animate-fade-in transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071910]/98 backdrop-blur-2xl rounded-3xl border border-[#163D2B]/90 shadow-[0_30px_70px_rgba(4,18,11,0.95)] overflow-hidden p-6 sm:p-7 border-t-[#386641]/50">
          {/* Top Header: Category Title + Link to view all */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#163D2B]/80">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FDE68A] shadow-[0_0_8px_#FDE68A]" />
              <h3 className="font-editorial text-2xl font-bold tracking-wide text-white">
                {category.title} Products
              </h3>
              <span className="hidden sm:inline-block text-xs text-[#A8BFA5] font-light ml-2 pl-3 border-l border-[#163D2B]">
                {category.subtitle}
              </span>
            </div>

            <Link
              to={category.href}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FDE68A] hover:text-white transition-colors group"
            >
              <span>Explore All {category.title}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* List of Products Only - No Subtopics, No Promo Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {category.products.map((item, idx) => (
              <Link
                key={idx}
                to={`/shop?category=${encodeURIComponent(category.title)}&type=${encodeURIComponent(item.query)}`}
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-[#0B2419]/50 hover:bg-[#163D2B]/90 border border-[#163D2B]/50 hover:border-[#386641] text-[#E0E7E1] hover:text-white transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#386641] group-hover:bg-[#FDE68A] group-hover:shadow-[0_0_6px_#FDE68A] shrink-0 transition-colors" />
                  <span className="text-xs sm:text-[13px] font-medium leading-relaxed group-hover:translate-x-0.5 transition-transform">
                    {item.name}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ml-2 ${
                      item.badge === 'Hot' || item.badge === 'Top Pick'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badge === 'Trending' || item.badge === 'India Essential'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#163D2B] text-[#A8BFA5] border border-[#386641]/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
