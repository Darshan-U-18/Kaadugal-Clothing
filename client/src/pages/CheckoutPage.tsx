import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Tag,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.addresses?.[0]?.phone || '');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  // Autofill if user profile changes
  useEffect(() => {
    if (user) {
      if (!email) setEmail(user.email);
      if (!fullName) setFullName(user.name);
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        if (!phone) setPhone(defaultAddr.phone);
        if (!street) setStreet(defaultAddr.street);
        if (!city) setCity(defaultAddr.city);
        if (!state) setState(defaultAddr.state);
        if (!postalCode) setPostalCode(defaultAddr.postalCode);
      }
    }
  }, [user]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError(null);
    const res = await applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponCode('');
    } else {
      setCouponError(res.message || 'Invalid coupon');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !phone || !street || !city || !postalCode) {
      setError('Please fill in all delivery details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items,
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          postalCode,
          country: 'India',
        },
        shippingMethod,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await api.createOrder(orderData);
      const createdOrder = res.order;

      if (paymentMethod === 'razorpay') {
        // Initialize Razorpay payment
        const rzpRes = await api.createRazorpayOrder(createdOrder.total, createdOrder.orderNumber);

        // Verify/simulate payment completion
        await api.verifyRazorpayPayment({
          orderId: createdOrder._id,
          razorpayOrderId: rzpRes.order.id,
          razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(2, 9),
        });
      }

      // Order completed successfully
      clearCart();
      navigate(`/order-confirmation/${createdOrder._id || createdOrder.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Could not complete your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
            Secure Sanctuary Checkout
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-white mt-1">
            Delivery & Payment
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-[#0B2419] p-6 sm:p-8 rounded-3xl border border-[#163D2B] shadow-xl">
              <h3 className="font-editorial text-2xl text-white mb-4">1. Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-[#0B2419] p-6 sm:p-8 rounded-3xl border border-[#163D2B] shadow-xl">
              <h3 className="font-editorial text-2xl text-white mb-4">2. Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Menon"
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                    Street Address & House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Flat 3B, Forest Green Residency, Indiranagar"
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560038"
                      className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Shipping Speed */}
            <div className="bg-[#0B2419] p-6 sm:p-8 rounded-3xl border border-[#163D2B] shadow-xl">
              <h3 className="font-editorial text-2xl text-white mb-4">3. Delivery Method</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    shippingMethod === 'standard'
                      ? 'border-[#386641] bg-[#163D2B]/50'
                      : 'border-[#163D2B] bg-[#071910] hover:bg-[#163D2B]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-[#386641] focus:ring-[#386641] accent-[#386641]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Standard Forest Courier</p>
                      <p className="text-[11px] text-[#A8BFA5]">Delivered within 4-5 business days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FDE68A]">
                    {subtotal >= 1500 ? 'FREE' : '₹99'}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    shippingMethod === 'express'
                      ? 'border-[#386641] bg-[#163D2B]/50'
                      : 'border-[#163D2B] bg-[#071910] hover:bg-[#163D2B]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-[#386641] focus:ring-[#386641] accent-[#386641]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Express Eco-Courier</p>
                      <p className="text-[11px] text-[#A8BFA5]">Fast 48-hour priority delivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FDE68A]">₹150</span>
                </label>
              </div>
            </div>

            {/* 4. Payment Selection */}
            <div className="bg-[#0B2419] p-6 sm:p-8 rounded-3xl border border-[#163D2B] shadow-xl">
              <h3 className="font-editorial text-2xl text-white mb-4">4. Payment Method</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#386641] bg-[#163D2B]/50'
                      : 'border-[#163D2B] bg-[#071910] hover:bg-[#163D2B]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="text-[#386641] focus:ring-[#386641] accent-[#386641]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#FDE68A]" />
                        <span className="text-xs font-semibold text-white">
                          Razorpay (Cards, UPI, NetBanking)
                        </span>
                        <span className="text-[10px] bg-[#163D2B] text-[#A8BFA5] border border-[#386641]/50 px-2 py-0.5 rounded-full font-semibold">
                          Encrypted Gateway
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8BFA5] mt-0.5">
                        Instant encrypted checkout with Indian Rupees (₹)
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#386641] bg-[#163D2B]/50'
                      : 'border-[#163D2B] bg-[#071910] hover:bg-[#163D2B]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#386641] focus:ring-[#386641] accent-[#386641]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#FDE68A]" />
                        <span className="text-xs font-semibold text-white">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8BFA5] mt-0.5">
                        Pay upon doorstep verification
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Order Summary Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B2419] p-6 sm:p-8 rounded-3xl border border-[#163D2B] shadow-2xl sticky top-28">
              <h3 className="font-editorial text-2xl text-white mb-4">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-6 divide-y divide-[#163D2B]">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 pt-3 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-xl bg-[#071910] shrink-0 border border-[#163D2B]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#A8BFA5]">
                        {item.size} • {item.color} • Qty {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-[#FDE68A] mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <div className="mb-6 pt-4 border-t border-[#163D2B]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#163D2B]/40 border border-[#386641]/50 rounded-xl text-xs">
                    <span className="text-white font-medium">
                      Coupon <strong className="text-[#FDE68A]">{appliedCoupon.code}</strong> applied
                    </span>
                    <button onClick={removeCoupon} className="text-red-400 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Promo code (e.g. FOREST10)"
                        className="flex-1 px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs uppercase text-white placeholder-gray-500 focus:outline-none focus:border-[#386641]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-[#163D2B] hover:bg-[#386641] text-white text-xs font-semibold rounded-xl transition-colors border border-[#386641]/50"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-[#A8BFA5] border-t border-[#163D2B] pt-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
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
                  <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                  <span className="font-semibold text-white">
                    {shippingMethod === 'express'
                      ? '₹150'
                      : subtotal >= 1500
                      ? 'FREE'
                      : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% included)</span>
                  <span className="font-semibold text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white border-t border-[#163D2B] pt-3">
                  <span>Total Payable</span>
                  <span className="text-[#FDE68A]">
                    ₹
                    {(
                      total + (shippingMethod === 'express' ? 150 : 0)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl font-medium text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Securing Your Order...' : 'Complete & Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#A8BFA5] text-center">
                <ShieldCheck className="w-4 h-4 text-[#FDE68A]" />
                <span>256-bit encrypted checkout. No card numbers stored.</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
