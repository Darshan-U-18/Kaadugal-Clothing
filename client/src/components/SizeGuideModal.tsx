import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  onOpenSizeFinder?: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSizeFinder,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const measurements = [
    { size: 'XS', chestIn: '36', lengthIn: '27', shoulderIn: '17', chestCm: '91', lengthCm: '68', shoulderCm: '43' },
    { size: 'S', chestIn: '38', lengthIn: '28', shoulderIn: '18', chestCm: '96', lengthCm: '71', shoulderCm: '46' },
    { size: 'M', chestIn: '40', lengthIn: '29', shoulderIn: '19', chestCm: '102', lengthCm: '74', shoulderCm: '48' },
    { size: 'L', chestIn: '42', lengthIn: '30', shoulderIn: '20', chestCm: '107', lengthCm: '76', shoulderCm: '51' },
    { size: 'XL', chestIn: '44', lengthIn: '31', shoulderIn: '21', chestCm: '112', lengthCm: '79', shoulderCm: '53' },
    { size: 'XXL', chestIn: '46', lengthIn: '32', shoulderIn: '22', chestCm: '117', lengthCm: '81', shoulderCm: '56' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B2419] text-[#F7F8F2] rounded-3xl shadow-2xl border border-[#163D2B] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071910] p-5 text-white flex items-center justify-between border-b border-[#163D2B]">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[#FDE68A]" />
            <h3 className="font-editorial text-2xl text-white">Sizing & Silhouette Guide</h3>
          </div>
          <button onClick={onClose} className="text-[#A8BFA5] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {onOpenSizeFinder && (
            <div className="mb-4 p-3.5 bg-gradient-to-r from-[#163D2B] via-[#0B2419] to-[#163D2B] border border-[#386641] rounded-2xl flex items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span className="text-[#F7F8F2] text-xs">Don't have a measuring tape?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSizeFinder();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#386641] hover:bg-[#437a4e] text-[#FDE68A] font-semibold tracking-wider uppercase text-[10px] border border-[#FDE68A]/40 transition-all flex items-center gap-1 shadow-sm shrink-0 hover:scale-105"
              >
                <Sparkles className="w-3 h-3 text-[#FDE68A]" />
                <span>Find My Size in 10s</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#A8BFA5]">
              Relaxed, contemporary drape. True to size for relaxed aesthetic; size down for a classic fit.
            </p>
            {/* Unit Switcher */}
            <div className="flex items-center bg-[#071910] rounded-xl p-1 border border-[#163D2B] text-xs shrink-0 ml-3">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  unit === 'in' ? 'bg-[#163D2B] text-[#FDE68A] font-bold' : 'text-[#A8BFA5] hover:text-white'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  unit === 'cm' ? 'bg-[#163D2B] text-[#FDE68A] font-bold' : 'text-[#A8BFA5] hover:text-white'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#163D2B] bg-[#071910]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0B2419] text-[#A8BFA5] uppercase tracking-wider font-semibold border-b border-[#163D2B]">
                <tr>
                  <th className="py-3 px-4 text-white">Size</th>
                  <th className="py-3 px-4">Chest</th>
                  <th className="py-3 px-4">Length</th>
                  <th className="py-3 px-4">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#163D2B]">
                {measurements.map((m) => (
                  <tr key={m.size} className="hover:bg-[#163D2B]/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[#FDE68A]">{m.size}</td>
                    <td className="py-2.5 px-4 text-[#A8BFA5]">
                      {unit === 'in' ? `${m.chestIn}"` : `${m.chestCm} cm`}
                    </td>
                    <td className="py-2.5 px-4 text-[#A8BFA5]">
                      {unit === 'in' ? `${m.lengthIn}"` : `${m.lengthCm} cm`}
                    </td>
                    <td className="py-2.5 px-4 text-[#A8BFA5]">
                      {unit === 'in' ? `${m.shoulderIn}"` : `${m.shoulderCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring tips */}
          <div className="mt-4 p-3 bg-[#163D2B]/40 border border-[#386641]/50 rounded-2xl text-xs text-[#A8BFA5]">
            <p className="font-semibold text-white mb-1">Measurement Tip:</p>
            <p>Measure around the fullest part of your chest, keeping the tape horizontal under the arms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
