import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getWishlist();
        setProducts(res.products);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
            Curated Sanctuary
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white mt-1">
            Your Saved Pieces
          </h1>
          <p className="text-sm text-[#A8BFA5] mt-2 font-light">
            Keep track of garments you intend to integrate into your mindful wardrobe.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#0B2419] border border-[#163D2B] rounded-2xl" />
            ))}
          </div>
        ) : !user ? (
          <div className="bg-[#0B2419] rounded-3xl p-12 text-center border border-[#163D2B] shadow-2xl max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-[#FDE68A] mx-auto mb-4 stroke-[1.5]" />
            <h3 className="font-editorial text-2xl text-white">Sign in to access your Wishlist</h3>
            <p className="text-xs text-[#A8BFA5] mt-2 mb-6">
              Your saved pieces will be synchronized across your devices.
            </p>
            <Link
              to="/login?redirect=/wishlist"
              className="px-6 py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 text-xs uppercase tracking-wider font-semibold rounded-xl inline-block shadow-md transition-all"
            >
              Sign In to Continue
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#0B2419] rounded-3xl p-12 text-center border border-[#163D2B] shadow-2xl max-w-md mx-auto">
            <Heart className="w-12 h-12 text-[#A8BFA5] mx-auto mb-4 stroke-[1.5]" />
            <h3 className="font-editorial text-2xl text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#A8BFA5] mt-1 mb-6">
              Tap the heart icon on any garment to save it here for later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md border border-[#386641]/50 transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
