import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Wind, Sun, Shield, Sparkles, ArrowRight } from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      {/* Editorial Hero Banner */}
      <div className="relative bg-[#0B2419] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#163D2B]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A8BFA5_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#163D2B]/80 border border-[#386641]/50 rounded-full text-xs font-semibold text-[#A8BFA5] tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span>The KAADUGAL Chronicle</span>
          </span>
          <h1 className="font-editorial text-5xl sm:text-7xl font-bold tracking-tight text-white">
            Born from the Forest. <br />
            <span className="italic font-normal text-[#FDE68A]">Grounded in Truth.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A8BFA5] font-light max-w-2xl mx-auto leading-relaxed pt-2">
            “Kaadugal” translates to ancient forests. We design modern everyday clothing that honors the silent wisdom of the woods.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">
        {/* Section 1: The Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
              01 / The Beginning
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white">
              The Whispers of the Shola
            </h2>
            <p className="text-sm text-[#A8BFA5] font-light leading-relaxed">
              KAADUGAL took root amidst the misty valleys of the Western Ghats—one of the world's most biodiverse tropical evergreen reserves. Walking beneath centuries-old Shola canopies, we witnessed a profound contrast between nature’s unhurried endurance and the frantic cycles of modern fast fashion.
            </p>
            <p className="text-sm text-[#A8BFA5] font-light leading-relaxed">
              We asked ourselves: What if a streetwear brand chose permanence over novelty? What if a t-shirt was engineered with the same quiet strength as the trees around us?
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[520px] w-full border border-[#163D2B]">
            <img
              src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
              alt="Misty Western Ghats Rainforest"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 2: Craftsmanship Pillars */}
        <div className="bg-[#0B2419] rounded-3xl p-8 sm:p-12 border border-[#163D2B] shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
              Material Ethics
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mt-1">
              Honest Standards
            </h2>
            <p className="text-xs text-[#A8BFA5] mt-2">
              We prioritize tangible, verified material choices over marketing buzzwords.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#163D2B] border border-[#386641] flex items-center justify-center text-[#FDE68A]">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl text-white">240 GSM Combed Cotton</h3>
              <p className="text-xs text-[#A8BFA5] font-light leading-relaxed">
                We use heavyweight organic combed cotton with extra-long staples. Thick enough to preserve its structured drop-shoulder drape through years of wear without thinning.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#163D2B] border border-[#386641] flex items-center justify-center text-[#FDE68A]">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl text-white">Botanical Earth Pigments</h3>
              <p className="text-xs text-[#A8BFA5] font-light leading-relaxed">
                Our signature forest greens, soothing sages, and rich mineral charcoals are dyed using closed-loop non-toxic pigments that eliminate harsh petrochemical effluence.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#163D2B] border border-[#386641] flex items-center justify-center text-[#FDE68A]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl text-white">Natural Coconut Trims</h3>
              <p className="text-xs text-[#A8BFA5] font-light leading-relaxed">
                Zero plastic buttons. Our shirts use natural discarded coconut shell and tagua palm buttons. Every garment is completely biodegradable at the end of its life cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: The Call to Action */}
        <div className="bg-gradient-to-br from-[#0B2419] to-[#163D2B] rounded-3xl p-10 sm:p-14 text-white text-center relative overflow-hidden border border-[#386641]/50 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#FDE68A] font-semibold">
              Join the Sanctuary
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-white">
              Step Into the Forest
            </h2>
            <p className="text-xs sm:text-sm text-[#A8BFA5] font-light leading-relaxed">
              Explore our current collection of heavyweight oversized tees, flax linen overshirts, and enduring cotton staples.
            </p>
            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FDE68A] hover:bg-amber-200 text-[#071910] rounded-xl text-xs uppercase tracking-wider font-bold shadow-xl transition-all"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

