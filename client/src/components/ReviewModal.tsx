import React, { useState } from 'react';
import { X, Star, AlertCircle, Check } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide your review feedback.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createReview({
        productId,
        rating,
        title,
        comment,
        userName: userName.trim() || user?.name || 'Nature Enthusiast',
        userEmail: userEmail.trim() || user?.email || 'guest@kaadugal.com',
      });
      setIsSuccess(true);
      // Dynamically reload reviews immediately
      onReviewSubmitted();
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setComment('');
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B2419] rounded-2xl shadow-2xl border border-[#163D2B]/50 overflow-hidden text-[#F7F8F2]">
        {/* Header */}
        <div className="bg-[#071910] p-5 text-white flex items-center justify-between border-b border-[#163D2B]/40">
          <div>
            <h3 className="font-editorial text-xl text-[#F7F8F2]">Share Your Experience</h3>
            <p className="text-xs text-[#A8BFA5] mt-0.5 line-clamp-1">{productName}</p>
          </div>
          <button onClick={onClose} className="text-[#A8BFA5] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-xl text-[#F7F8F2]">Review Submitted!</h4>
              <p className="text-xs text-[#A8BFA5] mt-1">Thank you for contributing to our community.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/40 text-red-200 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[#163D2B]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#FDE68A] ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              {!user && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Arjun M."
                      className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/50 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="arjun@domain.com"
                      className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/50 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Incredible fabric thickness and drape"
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/50 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the fit, texture, breathability, and feel..."
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/50 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#163D2B] hover:bg-emerald-800 text-white font-medium rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? 'Publishing Review...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
