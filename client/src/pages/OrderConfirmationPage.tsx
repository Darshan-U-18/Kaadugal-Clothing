import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';
import { api } from '../services/api';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#163D2B', '#386641', '#A8BFA5', '#FDE68A'],
    });

    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await api.getOrderById(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center">
        <p className="text-sm text-gray-500">Retrieving your forest order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-20 min-h-screen max-w-lg mx-auto px-4 text-center">
        <h2 className="font-editorial text-2xl text-[#0B2419]">Order details not found</h2>
        <Link to="/shop" className="mt-4 inline-block text-xs uppercase tracking-wider text-[#163D2B] underline">
          Return to catalog
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Ordered', done: true, desc: 'Confirmed & Logged' },
    { title: 'Processing', done: order.orderStatus !== 'ordered', desc: 'Crafting & Packing' },
    { title: 'Shipped', done: order.orderStatus === 'shipped' || order.orderStatus === 'delivered', desc: 'With Forest Courier' },
    { title: 'Delivered', done: order.orderStatus === 'delivered', desc: 'Doorstep Arrival' },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header Card */}
        <div className="bg-[#0B2419] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#163D2B] text-center mb-8">
          <div className="w-16 h-16 bg-[#163D2B] border border-[#386641] rounded-full flex items-center justify-center text-[#FDE68A] mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold block mb-1">
            Order Confirmed & Logged
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-white">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-sm text-[#A8BFA5] mt-2 font-light max-w-md mx-auto">
            Your journey with KAADUGAL has begun. A confirmation dispatch has been sent to{' '}
            <strong className="text-white">{order.customerEmail}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 bg-[#071910] rounded-xl text-xs font-mono text-[#FDE68A] border border-[#163D2B]">
            <span className="text-[#A8BFA5]">Order Reference:</span>
            <strong className="text-sm">{order.orderNumber}</strong>
          </div>
        </div>

        {/* Order Status Progress Tracker */}
        <div className="bg-[#0B2419] rounded-3xl p-8 shadow-xl border border-[#163D2B] mb-8">
          <h3 className="font-editorial text-2xl text-white mb-6">Delivery Progression</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {steps.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-xs transition-colors border ${
                    st.done
                      ? 'bg-[#163D2B] text-[#FDE68A] border-[#386641] shadow-md'
                      : 'bg-[#071910] text-[#A8BFA5]/60 border-[#163D2B]'
                  }`}
                >
                  {idx + 1}
                </div>
                <h5 className="text-xs font-semibold text-white">{st.title}</h5>
                <span className="text-[10px] text-[#A8BFA5] font-light mt-0.5">{st.desc}</span>
              </div>
            ))}
          </div>

          {order.trackingNumber && (
            <div className="mt-6 pt-4 border-t border-[#163D2B] flex items-center justify-between text-xs text-[#A8BFA5]">
              <span>Tracking Code: <strong className="font-mono text-[#FDE68A]">{order.trackingNumber}</strong></span>
              <span>Courier: <strong className="text-white">Forest Eco-Express</strong></span>
            </div>
          )}
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-[#0B2419] rounded-3xl p-8 shadow-xl border border-[#163D2B] mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-[#163D2B]">
            <h3 className="font-editorial text-2xl text-white">Purchased Garments</h3>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-[#A8BFA5] hover:text-[#FDE68A] font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Items List */}
          <div className="divide-y divide-[#163D2B] my-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-xl bg-[#071910] shrink-0 border border-[#163D2B]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                  <p className="text-xs text-[#A8BFA5] mt-0.5">
                    Size: {item.size} • Color: {item.color} • Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#FDE68A]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-[#163D2B] space-y-2 text-xs text-[#A8BFA5]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-white">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#FDE68A] font-medium">
                <span>Promotional Discount ({order.couponCode})</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping ({order.shippingMethod})</span>
              <span className="font-semibold text-white">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (Included)</span>
              <span className="text-white">₹{order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white border-t border-[#163D2B] pt-3">
              <span>Total Paid</span>
              <span className="text-[#FDE68A]">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B] shadow-xl">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Delivery Address</span>
            </h4>
            <p className="text-xs text-[#F7F8F2] leading-relaxed">
              <strong className="text-white">{order.shippingAddress.fullName}</strong><br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B] shadow-xl">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2">
              Payment Status
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-[#FDE68A] uppercase">
                {order.paymentMethod === 'razorpay' ? 'Paid Online via Razorpay' : 'Cash on Delivery (Pending)'}
              </span>
            </div>
            <p className="text-xs text-[#A8BFA5] font-light">
              Electronic tax receipt issued in compliance with Indian GST regulations.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-xl transition-all"
          >
            <span>Continue Exploring the Woods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
