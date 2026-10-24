import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface SmartSizeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSizes: string[];
  productName: string;
  onSelectSize: (size: string) => void;
}

export const SmartSizeFinderModal: React.FC<SmartSizeFinderModalProps> = ({
  isOpen,
  onClose,
  availableSizes = ['S', 'M', 'L', 'XL'],
  productName,
  onSelectSize,
}) => {
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [fitPreference, setFitPreference] = useState<'regular' | 'relaxed' | 'oversized'>('relaxed');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculateRecommendation = () => {
    let base = 'M';
    if (weightKg < 60) base = 'S';
    else if (weightKg <= 74) base = 'M';
    else if (weightKg <= 86) base = 'L';
    else if (weightKg <= 98) base = 'XL';
    else base = 'XXL';

    if (heightCm > 185 && base === 'S') base = 'M';
    if (heightCm > 188 && base === 'M') base = 'L';

    if (fitPreference === 'oversized') {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const idx = order.indexOf(base);
      if (idx !== -1 && idx < order.length - 1) base = order[idx + 1];
    } else if (fitPreference === 'regular') {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const idx = order.indexOf(base);
      if (idx > 0 && weightKg < 70) base = order[idx - 1];
    }

    if (!availableSizes.includes(base) && availableSizes.length > 0) {
      base = availableSizes[0];
    }

    setRecommendedSize(base);
  };

  const handleApply = (sz: string) => {
    onSelectSize(sz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-[#F7F8F2]">
      <div className="relative w-full max-w-md bg-[#0B2419] rounded-3xl shadow-2xl border border-[#163D2B] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071910] p-5 flex items-center justify-between border-b border-[#163D2B]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FDE68A]" />
            <h3 className="font-editorial text-2xl text-white">Smart Size Advisor</h3>
          </div>
          <button onClick={onClose} className="text-[#A8BFA5] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-[#A8BFA5]">
            Find your ideal silhouette for <span className="font-semibold text-white">{productName}</span> in 10 seconds.
          </p>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#A8BFA5] uppercase tracking-wider font-semibold">Your Height</span>
              <span className="font-bold text-[#FDE68A]">{heightCm} cm</span>
            </div>
            <input
              type="range"
              min={150}
              max={205}
              value={heightCm}
              onChange={(e) => {
                setHeightCm(Number(e.target.value));
                setRecommendedSize(null);
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#A8BFA5] uppercase tracking-wider font-semibold">Your Weight</span>
              <span className="font-bold text-[#FDE68A]">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min={45}
              max={120}
              value={weightKg}
              onChange={(e) => {
                setWeightKg(Number(e.target.value));
                setRecommendedSize(null);
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2">
              Preferred Silhouette Fit
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['regular', 'relaxed', 'oversized'] as const).map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => {
                    setFitPreference(fit);
                    setRecommendedSize(null);
                  }}
                  className={`py-2 text-xs font-semibold rounded-xl uppercase tracking-wider border transition-all cursor-pointer ${
                    fitPreference === fit
                      ? 'bg-[#163D2B] text-[#FDE68A] border-emerald-500/50 shadow-sm'
                      : 'bg-[#071910] text-[#A8BFA5] border-[#163D2B] hover:text-white'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {recommendedSize ? (
            <div className="p-4 bg-[#071910] rounded-2xl border border-emerald-500/40 text-center animate-fade-in">
              <span className="text-[11px] text-[#A8BFA5] uppercase tracking-wider block mb-1">
                Recommended For You
              </span>
              <span className="font-editorial text-4xl font-bold text-[#FDE68A] block mb-3">
                Size {recommendedSize}
              </span>
              <button
                type="button"
                onClick={() => handleApply(recommendedSize)}
                className="w-full py-2.5 bg-[#163D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-emerald-500/30 cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#FDE68A]" />
                <span>Select Size {recommendedSize}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={calculateRecommendation}
              className="w-full py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-500/40 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FDE68A]" />
              <span>Calculate Best Size</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
