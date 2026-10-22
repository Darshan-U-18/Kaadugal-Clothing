import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles, Leaf, CheckCircle2 } from 'lucide-react';
import { ForestCanvas } from '../components/forest3d/ForestCanvas';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../services/api';

export const HomePage: React.FC = () => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.getProducts({ limit: 12 });
        const all = res.products;
        setBestsellers(all.filter((p) => p.isBestseller).slice(0, 4));
        setNewArrivals(all.filter((p) => p.isNewArrival).slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = [
    {
      title: 'Mens',
      subtitle: 'Structured dropped-shoulders & linen blends',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
      link: '/shop?category=Mens',
    },
    {
      title: 'Womens',
      subtitle: 'Airy linen smocks & minimalist organic crops',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      link: '/shop?category=Womens',
    },
    {
      title: 'Kids',
      subtitle: 'Ultra-soft organic cotton for young explorers',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1000&q=80',
      link: '/shop?category=Kids',
    },
    {
      title: 'GenZ',
      subtitle: 'Oversized boxy silhouettes & raw mineral streetwear',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      link: '/shop?category=GenZ',
    },
  ];

  return (
    <div className="relative bg-[#071910] text-[#F7F8F2]">
      {/* ========================================================
          3D CINEMATIC FOREST HERO SECTION
         ======================================================== */}
      <section className="relative w-full min-h-[92vh] md:min-h-screen py-16 flex items-center justify-center overflow-hidden">
        {/* Full 3D Interactive Three.js Forest Background */}
        <div className="absolute inset-0 z-0">
          <ForestCanvas />
        </div>

        {/* Hero Editorial Copy Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-8 sm:mt-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071910]/60 backdrop-blur-md border border-[#386641]/50 text-[#FDE68A] text-xs uppercase tracking-[0.3em] font-semibold mb-6 animate-float shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span>Rooted in Nature</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none mb-6 drop-shadow-2xl">
            Wear Your Roots.
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl font-light text-[#F7F8F2]/90 leading-relaxed tracking-wide mb-10 drop-shadow">
            Everyday essentials inspired by nature. Designed for your journey.
            Crafted from 240 GSM organic cotton and pure earth dyes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/60 rounded-xl font-medium text-sm tracking-wider uppercase transition-all shadow-2xl hover:shadow-[#163D2B]/50 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/our-story"
              className="w-full sm:w-auto px-8 py-4 bg-[#071910]/60 hover:bg-[#163D2B]/60 backdrop-blur-md text-white border border-[#386641]/50 rounded-xl font-medium text-sm tracking-wider uppercase transition-all hover:scale-105 flex items-center justify-center"
            >
              Discover Our Story
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/80 animate-bounce">
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium mb-1 text-[#A8BFA5]">
            Explore the forest
          </span>
          <ChevronDown className="w-4 h-4 text-[#A8BFA5]" />
        </div>
      </section>

      {/* ========================================================
          FEATURED CATEGORIES (Mens, Womens, Kids, GenZ)
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
            Curated Lines
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-white mt-2 tracking-tight">
            Designed for the Elements
          </h2>
          <p className="text-sm text-[#A8BFA5] mt-3 font-light leading-relaxed">
            Minimalist silhouettes born from organic materials, tailored for seamless transitions between city and wilderness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#163D2B]/80 transition-all duration-500 border border-[#163D2B]"
            >
              {/* Background Photography */}
              <img
                src={cat.image}
                alt={cat.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover object-top sm:object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Darkening Gradient Overlay with Deep Forest Tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071910] via-[#0B2419]/40 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Title and Shopping Action */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#FDE68A] font-semibold mb-1">
                  Explore Line
                </span>
                <h3 className="font-editorial text-3xl font-bold tracking-wide text-white group-hover:text-[#FDE68A] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#A8BFA5] font-light mt-1 mb-4 line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A8BFA5] group-hover:text-white transition-colors">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          BESTSELLERS SECTION ("Made for Every Day")
         ======================================================== */}
      <section className="py-24 bg-[#0A2417] border-y border-[#163D2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
                Timeless Staples
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl text-white mt-2 tracking-tight">
                Made for Every Day
              </h2>
              <p className="text-sm text-[#A8BFA5] mt-2 font-light">
                Our most coveted garments, tailored in small batch organic runs.
              </p>
            </div>
            <Link
              to="/shop"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#FDE68A] hover:text-white transition-colors group"
            >
              <span>View All Pieces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-[#071910] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          EDITORIAL BRAND STORY ("Rooted in Nature. Made for You.")
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photography Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#163D2B] aspect-[4/5] max-h-[520px] w-full">
              <img
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
                alt="Ancient Shola Forest Canopy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071910] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-mono tracking-wider text-[#FDE68A] uppercase">
                  11°24'N, 76°42'E — Nilgiri Biosphere
                </span>
                <p className="font-editorial text-2xl mt-1">
                  “Where ancient trees whisper, our silhouettes take form.”
                </p>
              </div>
            </div>

            {/* Overlapping Floating Detail Card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-64 bg-[#0B2419]/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-[#163D2B]">
              <span className="text-[10px] uppercase tracking-wider text-[#FDE68A] font-bold block mb-1">
                Zero Synthetics
              </span>
              <p className="text-xs text-[#A8BFA5] leading-relaxed">
                Every fiber is compostable, free of microplastics, and colored using mineral and botanical pigments.
              </p>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="lg:col-span-6 lg:pl-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#163D2B] border border-[#386641] rounded-full text-xs font-semibold text-[#A8BFA5] tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>Philosophy</span>
            </div>

            <h2 className="font-editorial text-4xl sm:text-6xl text-white tracking-tight leading-[1.1]">
              Rooted in Nature. <br />
              <span className="italic font-normal text-[#A8BFA5]">Made for You.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#A8BFA5] font-light leading-relaxed">
              KAADUGAL was founded on a simple conviction: fast fashion disconnects us from the earth, while true clothing should remind us where we come from.
            </p>

            <p className="text-sm sm:text-base text-[#A8BFA5] font-light leading-relaxed">
              We source only long-staple Indian organic cotton grown without synthetic pesticides, woven into thick 240 GSM jerseys that hold their drape for years. When you wear KAADUGAL, you carry the peaceful silence of the forest with you.
            </p>

            {/* Craftsmanship Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#163D2B]">
              <div>
                <span className="font-editorial text-3xl font-bold text-[#FDE68A] block">240</span>
                <span className="text-[11px] text-[#A8BFA5] uppercase tracking-wider">GSM Organic</span>
              </div>
              <div>
                <span className="font-editorial text-3xl font-bold text-[#FDE68A] block">100%</span>
                <span className="text-[11px] text-[#A8BFA5] uppercase tracking-wider">Biodegradable</span>
              </div>
              <div>
                <span className="font-editorial text-3xl font-bold text-[#FDE68A] block">0%</span>
                <span className="text-[11px] text-[#A8BFA5] uppercase tracking-wider">Microplastics</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <span>Read the Complete Narrative</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          NEW ARRIVALS / SEASONAL CAPSULE SHOWCASE
         ======================================================== */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-[#071910] border-t border-[#163D2B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
                  Just In
                </span>
                <h2 className="font-editorial text-4xl sm:text-5xl text-white mt-2 tracking-tight">
                  The Shola Canopy Series
                </h2>
                <p className="text-sm text-[#A8BFA5] mt-2 font-light">
                  Fresh silhouettes tailored in forest moss, earthy sage, and unbleached cream cotton.
                </p>
              </div>
              <Link
                to="/shop?sort=newest"
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#FDE68A] hover:text-white transition-colors group"
              >
                <span>Explore All New</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          COMMUNITY & VERIFIED REVIEWS
         ======================================================== */}
      <section className="py-24 bg-[#092215] border-t border-[#163D2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
              Voices of the Woods
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-white mt-2 tracking-tight">
              Crafted to Endure
            </h2>
            <p className="text-sm text-[#A8BFA5] mt-2 font-light">
              Reflections from members of the KAADUGAL community across the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Arjun Menon',
                city: 'Kochi, Kerala',
                product: 'Forest Oversized T-Shirt',
                quote:
                  'The 240 GSM organic cotton feels incredibly substantial yet breathable in South Indian weather. The deep forest green is uniquely rich and subtle—nothing like generic olive green.',
                rating: 5,
              },
              {
                name: 'Sneha Rao',
                city: 'Bengaluru, Karnataka',
                product: 'Sage Relaxed Shirt',
                quote:
                  'The Belgian flax linen-cotton blend has the most relaxed drape. Natural coconut buttons and double stitching show obsessive attention to craft. Has become my weekly staple.',
                rating: 5,
              },
              {
                name: 'Karan Dave',
                city: 'Mumbai, Maharashtra',
                product: 'Forest Heavyweight Hoodie',
                quote:
                  'The 400 GSM French Terry is unmatched. Double lined hood, deep pockets, and heavy ribbing that stays rigid after multiple washes. True luxury streetwear.',
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-[#0B2419] border border-[#163D2B] flex flex-col justify-between shadow-xl hover:border-[#386641] transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#FDE68A] mb-4">
                    {[...Array(review.rating)].map((_, s) => (
                      <span key={s} className="text-base">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#F7F8F2] font-light leading-relaxed italic mb-6">
                    “{review.quote}”
                  </p>
                </div>

                <div className="pt-4 border-t border-[#163D2B] flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-semibold text-white">{review.name}</h5>
                    <span className="text-xs text-[#A8BFA5]">{review.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          INSTAGRAM LOOKBOOK / ATMOSPHERIC GALLERY
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
            Visual Journal
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white mt-2">
            #WearYourRoots
          </h2>
          <p className="text-xs text-[#A8BFA5] mt-1">
            Tag @kaadugalclothing to be featured in our seasonal lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
          ].map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-[#163D2B] transition-all"
            >
              <img
                src={img}
                alt="KAADUGAL Community Fashion Look"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#071910]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium tracking-wider">
                <span>View Look</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
