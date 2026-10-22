import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onOpenAuth?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenAuth }) => {
  const { addToCart } = useCart();
  const { user, isInWishlist, toggleWishlist } = useAuth();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isWishlisting, setIsWishlisting] = useState<boolean>(false);

  const isFavorited = isInWishlist(product._id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    try {
      setIsWishlisting(true);
      await toggleWishlist(product._id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWishlisting(false);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    const primaryColor = (product.colors && product.colors[0]?.name) || 'Forest Green';
    addToCart(product, size, primaryColor, 1);
  };

  const getFallbackImage = () => {
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('women')) {
      return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80';
    }
    if (cat.includes('kid')) {
      return 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80';
    }
    if (cat.includes('gen')) {
      return 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80';
    }
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';
  };

  return (
    <div
      className="group relative flex flex-col bg-[#0B2419] rounded-2xl overflow-hidden border border-[#163D2B] shadow-lg hover:shadow-2xl hover:border-[#386641] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <Link to={`/product/${product.slug || product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-[#071910]">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : getFallbackImage()}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = getFallbackImage();
          }}
          className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-[#071910]/90 backdrop-blur-md text-[#FDE68A] border border-[#FDE68A]/30 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#163D2B]/90 backdrop-blur-md text-[#A8BFA5] border border-[#386641] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
              New Arrival
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="bg-[#386641] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm">
              {product.discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={isWishlisting}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-red-950/80 text-red-400 border border-red-800 shadow-md'
              : 'bg-[#071910]/70 hover:bg-[#163D2B] text-white/80 border border-white/10 shadow-sm'
          }`}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Size Select Overlay on Desktop Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 p-2.5 bg-[#071910]/95 backdrop-blur-md rounded-xl shadow-2xl border border-[#163D2B] transition-all duration-300 hidden md:block ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider text-[#A8BFA5] font-semibold mb-1.5 text-center">
            Quick Add Size
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleQuickAdd(e, sz)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#163D2B] hover:bg-[#386641] hover:text-[#FDE68A] text-white border border-[#386641]/50 transition-colors"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-[#0B2419]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#A8BFA5] mb-1">
            <span className="uppercase tracking-wider font-medium text-[#A8BFA5]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-white/40 font-normal">({product.numReviews})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug || product._id}`}
            className="block text-sm font-semibold text-[#F7F8F2] hover:text-[#FDE68A] transition-colors line-clamp-1 mb-1.5"
          >
            {product.name}
          </Link>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="w-3 h-3 rounded-full border border-white/20 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-[11px] text-[#A8BFA5]/60 ml-1">
                {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="pt-2 border-t border-[#163D2B] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#FDE68A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-white/40 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#A8BFA5]/60 font-light">Incl. taxes</p>
          </div>

          <button
            onClick={(e) => handleQuickAdd(e, product.sizes[0] || 'M')}
            className="md:hidden p-2 rounded-xl bg-[#163D2B] text-white hover:bg-[#386641] transition-colors border border-[#386641]/50 shadow-sm"
            aria-label="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
