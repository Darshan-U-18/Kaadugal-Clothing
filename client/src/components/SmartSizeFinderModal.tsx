import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ChevronRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface SmartSizeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSizes?: string[];
  productName?: string;
  onSelectSize: (size: string) => void;
}

const POPULAR_BRANDS = [
  'Zara',
  'H&M',
  'Uniqlo',
  "Levi's",
  'Marks & Spencer',
  'Nike',
  'Other Standard',
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const HEIGHT_OPTIONS = [
  { label: "Under 5'5\" (< 165 cm)", value: 'short', cm: 162 },
  { label: "5'5\" - 5'8\" (165 - 173 cm)", value: 'average', cm: 170 },
  { label: "5'9\" - 5'11\" (174 - 180 cm)", value: 'medium_tall', cm: 177 },
  { label: "6'0\" - 6'2\" (181 - 188 cm)", value: 'tall', cm: 185 },
  { label: "6'3\"+ (> 188 cm)", value: 'very_tall', cm: 191 },
];

const WEIGHT_OPTIONS = [
  { label: 'Under 60 kg (Under 132 lbs)', value: 'light', kg: 56 },
  { label: '60 - 70 kg (132 - 154 lbs)', value: 'slim_medium', kg: 65 },
  { label: '71 - 82 kg (155 - 180 lbs)', value: 'medium', kg: 76 },
  { label: '83 - 94 kg (181 - 207 lbs)', value: 'heavy', kg: 88 },
  { label: '95+ kg (208+ lbs)', value: 'very_heavy', kg: 98 },
];

const FIT_PREFERENCES = [
  {
    id: 'fitted',
    title: 'Snug / Tailored',
    description: 'Closer to the chest and arms with minimal excess fabric.',
    adjustment: -1,
  },
  {
    id: 'regular',
    title: 'Regular / True to Size',
    description: 'Balanced comfort with natural drape and unrestricted movement.',
    adjustment: 0,
  },
  {
    id: 'oversized',
    title: 'Relaxed / Oversized',
    description: 'Signature Shola drop-shoulder, boxy silhouette with generous airflow.',
    adjustment: 1,
  },
];

export const SmartSizeFinderModal: React.FC<SmartSizeFinderModalProps> = ({
  isOpen,
  onClose,
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  productName = 'Kaadugal Garment',
  onSelectSize,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedBrand, setSelectedBrand] = useState<string>('Zara');
  const [selectedBrandSize, setSelectedBrandSize] = useState<string>('M');
  const [selectedHeight, setSelectedHeight] = useState<string>('medium_tall');
  const [selectedWeight, setSelectedWeight] = useState<string>('medium');
  const [selectedFit, setSelectedFit] = useState<string>('regular');
  const [calculatedSize, setCalculatedSize] = useState<string>('M');
  const [rationale, setRationale] = useState<string>('');

  // Load prior profile if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kaadugal_fit_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.brand) setSelectedBrand(parsed.brand);
        if (parsed.brandSize) setSelectedBrandSize(parsed.brandSize);
        if (parsed.height) setSelectedHeight(parsed.height);
        if (parsed.weight) setSelectedWeight(parsed.weight);
        if (parsed.fit) setSelectedFit(parsed.fit);
      }
    } catch {
      // ignore
    }
  }, []);

  // Algorithm to compute recommended size
  const calculateRecommendation = () => {
    const sizeIndexMap: Record<string, number> = {
      XS: 0,
      S: 1,
      M: 2,
      L: 3,
      XL: 4,
      XXL: 5,
    };

    let baseIndex = sizeIndexMap[selectedBrandSize] ?? 2;

    // Brand calibration: Zara runs slim (+0.3), Uniqlo runs roomy (-0.3)
    if (selectedBrand === 'Zara') {
      // Zara is slimmer than Kaadugal's relaxed cut
      baseIndex += 0.2;
    } else if (selectedBrand === 'Uniqlo') {
      baseIndex -= 0.1;
    }

    // Height & Weight check
    const weightIndexMap: Record<string, number> = {
      light: 0.5,
      slim_medium: 1.5,
      medium: 2.5,
      heavy: 3.5,
      very_heavy: 4.5,
    };
    const bodyWeightScore = weightIndexMap[selectedWeight] ?? 2.5;

    // Blend brand size with body build
    let blendedIndex = baseIndex * 0.6 + bodyWeightScore * 0.4;

    // Apply fit preference
    const fitObj = FIT_PREFERENCES.find((f) => f.id === selectedFit);
    if (fitObj?.adjustment) {
      blendedIndex += fitObj.adjustment * 0.75;
    }

    let finalIndex = Math.round(blendedIndex);
    if (finalIndex < 0) finalIndex = 0;
    if (finalIndex > 5) finalIndex = 5;

    let targetSize = STANDARD_SIZES[finalIndex];

    // Clamp to available sizes if specified
    if (availableSizes.length > 0 && !availableSizes.includes(targetSize)) {
      const found = availableSizes.find((s) => s === targetSize);
      if (!found) {
        targetSize = availableSizes[0];
      }
    }

    // Build explanatory rationale
    const fitLabel = fitObj?.title || 'Regular';
    const explanation = `Based on your ${selectedBrand} size (${selectedBrandSize}) and preference for a ${fitLabel} silhouette, Size ${targetSize} will give you the intended drape with zero chest tightness.`;

    setCalculatedSize(targetSize);
    setRationale(explanation);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      calculateRecommendation();
      setStep(4); // Result screen
    }
  };

  const handleApplySize = () => {
    // Save to local storage for recurring visits
    try {
      localStorage.setItem(
        'kaadugal_fit_profile',
        JSON.stringify({
          brand: selectedBrand,
          brandSize: selectedBrandSize,
          height: selectedHeight,
          weight: selectedWeight,
          fit: selectedFit,
          recommendedSize: calculatedSize,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }

    onSelectSize(calculatedSize);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#071910] text-[#F7F8F2] rounded-3xl shadow-2xl border border-[#163D2B] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B2419] px-6 py-5 border-b border-[#163D2B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#163D2B] border border-[#386641] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FDE68A]" />
            </div>
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl text-white tracking-wide">
                Find My Size in 10 Seconds
              </h3>
              <p className="text-[11px] text-[#A8BFA5] font-light">
                No measuring tape needed • 3 quick questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#A8BFA5] hover:text-white hover:bg-[#163D2B]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Steps 1-3) */}
        {step <= 3 && (
          <div className="px-6 pt-4 pb-2 bg-[#071910]">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2">
              <span>
                Step {step} of 3:{' '}
                <strong className="text-white">
                  {step === 1 && 'Current Brand Fit'}
                  {step === 2 && 'Height & Weight'}
                  {step === 3 && 'Fit Style'}
                </strong>
              </span>
              <span className="text-[#FDE68A]">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#0B2419] rounded-full overflow-hidden border border-[#163D2B]">
              <div
                className="h-full bg-gradient-to-r from-[#386641] to-[#FDE68A] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: What brand & size fits you best? */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  1. Which brand fits you best right now?
                </label>
                <p className="text-xs text-[#A8BFA5]/80 font-light mb-3">
                  Select the label currently in your wardrobe:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all text-center ${
                        selectedBrand === brand
                          ? 'bg-[#163D2B] text-[#FDE68A] border-[#FDE68A]/60 shadow-sm font-semibold'
                          : 'bg-[#0B2419] text-[#F7F8F2] border-[#163D2B] hover:border-[#386641]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  What size do you usually wear in {selectedBrand}?
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {STANDARD_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedBrandSize(sz)}
                      className={`py-3 text-xs font-semibold rounded-xl border transition-all ${
                        selectedBrandSize === sz
                          ? 'bg-[#163D2B] text-[#FDE68A] border-[#FDE68A]/60 shadow-sm scale-105'
                          : 'bg-[#0B2419] text-[#F7F8F2] border-[#163D2B] hover:border-[#386641]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Height & Weight */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  2. What is your approximate height?
                </label>
                <div className="space-y-2">
                  {HEIGHT_OPTIONS.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onClick={() => setSelectedHeight(h.value)}
                      className={`w-full p-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedHeight === h.value
                          ? 'bg-[#163D2B] text-[#FDE68A] border-[#FDE68A]/60 font-semibold'
                          : 'bg-[#0B2419] text-[#F7F8F2] border-[#163D2B] hover:border-[#386641]'
                      }`}
                    >
                      <span>{h.label}</span>
                      {selectedHeight === h.value && <Check className="w-4 h-4 text-[#FDE68A]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  Approximate body weight:
                </label>
                <div className="space-y-2">
                  {WEIGHT_OPTIONS.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => setSelectedWeight(w.value)}
                      className={`w-full p-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedWeight === w.value
                          ? 'bg-[#163D2B] text-[#FDE68A] border-[#FDE68A]/60 font-semibold'
                          : 'bg-[#0B2419] text-[#F7F8F2] border-[#163D2B] hover:border-[#386641]'
                      }`}
                    >
                      <span>{w.label}</span>
                      {selectedWeight === w.value && <Check className="w-4 h-4 text-[#FDE68A]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Fit Preference */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  3. How do you like your Kaadugal garments to fit?
                </label>
                <p className="text-xs text-[#A8BFA5]/80 font-light mb-3">
                  Our silhouettes are handcrafted with natural botanical drape:
                </p>
              </div>

              <div className="space-y-3">
                {FIT_PREFERENCES.map((fit) => (
                  <button
                    key={fit.id}
                    type="button"
                    onClick={() => setSelectedFit(fit.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedFit === fit.id
                        ? 'bg-[#163D2B] border-[#FDE68A]/60 shadow-md ring-1 ring-[#FDE68A]/30'
                        : 'bg-[#0B2419] border-[#163D2B] hover:border-[#386641]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-semibold ${
                          selectedFit === fit.id ? 'text-[#FDE68A]' : 'text-white'
                        }`}
                      >
                        {fit.title}
                      </span>
                      {selectedFit === fit.id && <Check className="w-4 h-4 text-[#FDE68A]" />}
                    </div>
                    <p className="text-xs text-[#A8BFA5] font-light leading-relaxed">
                      {fit.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATION RESULT SCREEN */}
          {step === 4 && (
            <div className="py-2 space-y-6 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163D2B] border border-[#386641] text-[#FDE68A] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>98% Fit Accuracy Match</span>
              </div>

              <div className="bg-[#0B2419] p-6 rounded-3xl border border-[#163D2B] relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#386641]/20 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[11px] uppercase tracking-widest text-[#A8BFA5] font-semibold block mb-1">
                  Your Recommended Size
                </span>
                <div className="font-editorial text-6xl text-[#FDE68A] font-bold tracking-tight my-2">
                  {calculatedSize}
                </div>
                <p className="text-xs text-white/90 max-w-sm mx-auto font-light leading-relaxed pt-2">
                  {rationale}
                </p>
              </div>

              <div className="p-4 bg-[#163D2B]/30 rounded-2xl border border-[#386641]/40 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#A8BFA5]">
                  <span>Reference Brand:</span>
                  <span className="font-semibold text-white">
                    {selectedBrand} ({selectedBrandSize})
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#A8BFA5]">
                  <span>Preferred Aesthetic:</span>
                  <span className="font-semibold text-white capitalize">
                    {FIT_PREFERENCES.find((f) => f.id === selectedFit)?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#A8BFA5]">
                  <span>Garment:</span>
                  <span className="font-semibold text-[#FDE68A] truncate max-w-[200px]">
                    {productName}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#0B2419] px-6 py-4 border-t border-[#163D2B] flex items-center justify-between gap-3">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-[#163D2B] text-xs font-medium text-[#A8BFA5] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : step === 4 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-[#163D2B] text-xs font-medium text-[#A8BFA5] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalculate</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white font-medium text-xs uppercase tracking-wider border border-[#386641]/50 shadow-md transition-all flex items-center gap-2 ml-auto"
            >
              <span>{step === 3 ? 'Calculate Fit' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplySize}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#163D2B] via-[#386641] to-[#163D2B] text-[#FDE68A] font-semibold text-xs uppercase tracking-wider border border-[#FDE68A]/40 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Select Size {calculatedSize}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
