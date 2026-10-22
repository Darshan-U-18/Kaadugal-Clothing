import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);
    setIsApplying(true);

    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);

    if (res.success) {
      setCouponInput('');
    } else {
      setCouponError(res.message || 'Invalid coupon code');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0B2419] text-[#F7F8F2] shadow-2xl flex flex-col h-full border-l border-[#163D2B] z-10 animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-[#163D2B] flex items-center justify-between bg-[#071910]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#A8BFA5]" />
            <h3 className="font-editorial text-2xl tracking-wide text-white">
              Your Shopping Bag
            </h3>
            <span className="text-xs bg-[#163D2B] text-[#FDE68A] border border-[#386641]/50 px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#A8BFA5] hover:text-white transition-colors rounded-lg hover:bg-white/10"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#071910]/80 text-[#F7F8F2] p-3.5 px-5 border-b border-[#163D2B]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
              {amountNeededForFreeShipping === 0
                ? 'You have unlocked FREE Forest Delivery!'
                : `Add ₹${amountNeededForFreeShipping.toLocaleString('en-IN')} more for FREE Shipping`}
            </span>
            <span className="text-[#FDE68A] font-semibold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-[#0B2419] h-1.5 rounded-full overflow-hidden border border-[#163D2B]">
            <div
              className="bg-gradient-to-r from-[#386641] to-[#A8BFA5] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#163D2B] flex items-center justify-center text-[#A8BFA5] mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="font-editorial text-2xl text-white mb-1">Your bag is empty</h4>
              <p className="text-xs text-[#A8BFA5] max-w-xs mb-6">
                Discover nature-inspired essentials tailored for everyday wanderings.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 p-3.5 bg-[#071910] rounded-2xl border border-[#163D2B] shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-xl bg-[#0B2419] shrink-0 border border-[#163D2B]"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-[#A8BFA5] hover:text-red-400 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#A8BFA5]">
                      <span>Size: <strong className="text-[#FDE68A]">{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-[#FDE68A]">{item.color}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#163D2B] rounded-lg bg-[#0B2419]">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="p-1 hover:bg-[#163D2B] text-[#A8BFA5] hover:text-white rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="p-1 hover:bg-[#163D2B] text-[#A8BFA5] hover:text-white rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#FDE68A]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      {item.originalPrice && (
                        <div className="text-[11px] text-[#A8BFA5]/60 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary */}
        {items.length > 0 && (
          <div className="p-5 bg-[#071910] border-t border-[#163D2B] space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#163D2B]/40 border border-[#386641]/50 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Tag className="w-4 h-4 text-[#FDE68A]" />
                    <span>Coupon <strong className="text-[#FDE68A]">{appliedCoupon.code}</strong> applied</span>
                    <span className="text-[#A8BFA5]">(-₹{discountAmount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-400 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#A8BFA5]" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code (e.g. FOREST10)"
                      className="w-full pl-9 pr-3 py-2 bg-[#0B2419] border border-[#163D2B] rounded-xl text-xs uppercase text-white placeholder-gray-500 focus:outline-none focus:border-[#386641]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-[#163D2B] hover:bg-[#386641] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 border border-[#386641]/50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#A8BFA5] border-t border-[#163D2B] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-white">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#FDE68A]">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-white">
                  {shippingFee === 0 ? (
                    <span className="text-[#FDE68A] font-semibold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% included)</span>
                <span className="font-medium text-white">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white border-t border-[#163D2B] pt-2">
                <span>Total</span>
                <span className="text-[#FDE68A]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
