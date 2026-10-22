import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Leaf, Shield, Truck, RefreshCw, Compass, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0B2419] text-[#F7F8F2] pt-16 pb-10 border-t border-[#163D2B]">
      {/* Brand Ethos Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#163D2B]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-3 bg-[#163D2B] rounded-2xl text-[#A8BFA5] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">100% GOTS Organic</h4>
              <p className="text-xs text-[#A8BFA5] mt-1 font-light">
                Combed organic cotton & natural botanical dyes.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-3 bg-[#163D2B] rounded-2xl text-[#A8BFA5] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Carbon-Neutral Delivery</h4>
              <p className="text-xs text-[#A8BFA5] mt-1 font-light">
                Free shipping across India on orders over ₹1,500.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-3 bg-[#163D2B] rounded-2xl text-[#A8BFA5] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">14-Day Easy Exchanges</h4>
              <p className="text-xs text-[#A8BFA5] mt-1 font-light">
                Hassle-free doorstep pickup & size swap.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-3 bg-[#163D2B] rounded-2xl text-[#A8BFA5] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Secure Payments</h4>
              <p className="text-xs text-[#A8BFA5] mt-1 font-light">
                256-bit encrypted checkout with Razorpay & UPI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="KAADUGAL Brand Mark"
                className="w-11 h-11 rounded-xl object-cover border border-[#163D2B] shadow-md"
              />
              <div>
                <span className="font-editorial text-2xl font-bold tracking-wider block">
                  KAADUGAL
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A8BFA5]">
                  Wear Your Roots
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A8BFA5] font-light leading-relaxed max-w-sm">
              Born from the ancient forest canopies of the Western Ghats. We craft timeless everyday essentials, heavyweight oversized tees, and relaxed linen wear that connects the modern soul back to nature.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#163D2B] flex items-center justify-center text-[#A8BFA5] hover:text-white hover:bg-[#386641] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#163D2B] flex items-center justify-center text-[#A8BFA5] hover:text-white hover:bg-[#386641] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#163D2B] flex items-center justify-center text-[#A8BFA5] hover:text-white hover:bg-[#386641] transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Collections */}
          <div>
            <h5 className="font-editorial text-lg text-white mb-4 tracking-wider">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#A8BFA5]">
              <li>
                <Link to="/shop?category=Men%27s+Collection" className="hover:text-white transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Women%27s+Collection" className="hover:text-white transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Oversized+Tees" className="hover:text-white transition-colors">
                  Oversized Heavyweight Tees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Everyday+Essentials" className="hover:text-white transition-colors">
                  Everyday Cotton Basics
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  View All Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Ethos & Care */}
          <div>
            <h5 className="font-editorial text-lg text-white mb-4 tracking-wider">Our World</h5>
            <ul className="space-y-2.5 text-xs text-[#A8BFA5]">
              <li>
                <Link to="/our-story" className="hover:text-white transition-colors">
                  Our Forest Story
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-white transition-colors">
                  Organic Combed Cotton
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  care@kaadugal.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h5 className="font-editorial text-lg text-white mb-2 tracking-wider">
              Forest Dispatch
            </h5>
            <p className="text-xs text-[#A8BFA5] mb-4 font-light leading-relaxed">
              Receive private previews of limited seasonal capsules and 10% off your first purchase.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#163D2B] rounded-xl text-xs text-[#A8BFA5] flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Welcome to our forest sanctuary.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-[#163D2B] border border-[#386641] rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#A8BFA5]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#386641] hover:bg-[#A8BFA5] hover:text-[#0B2419] rounded-lg text-white transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 block">
                  Zero spam. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#163D2B]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8BFA5] gap-4">
        <p>© 2026 KAADUGAL Clothing. All rights reserved. Born from the Forest.</p>
        <div className="flex items-center gap-3 text-[11px] font-mono tracking-wider">
          <span className="px-2 py-1 bg-[#163D2B] rounded border border-[#386641]/50">UPI</span>
          <span className="px-2 py-1 bg-[#163D2B] rounded border border-[#386641]/50">RAZORPAY</span>
          <span className="px-2 py-1 bg-[#163D2B] rounded border border-[#386641]/50">RUPAY</span>
          <span className="px-2 py-1 bg-[#163D2B] rounded border border-[#386641]/50">VISA / MC</span>
          <span className="px-2 py-1 bg-[#163D2B] rounded border border-[#386641]/50">NETBANKING</span>
        </div>
      </div>
    </footer>
  );
};
