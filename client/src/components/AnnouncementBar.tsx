import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AnnouncementBarProps {
  message?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = 'Nature-inspired essentials | Free shipping on eligible orders over ₹1,500',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#0B2419] text-[#F7F8F2] text-xs font-medium py-2 px-4 transition-all duration-300 border-b border-[#163D2B] relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center flex items-center justify-center gap-2 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#A8BFA5]" />
          <span>{message}</span>
          <span className="hidden sm:inline text-[#A8BFA5] font-serif italic text-xs ml-1">
            — Code: FOREST10 for 10% off
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#A8BFA5] hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
