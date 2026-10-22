import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  Heart,
  User as UserIcon,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const AccountPage: React.FC = () => {
  const { user, logout, addAddress, deleteAddress } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Address Form State
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ordRes, wishRes] = await Promise.all([
          api.getMyOrders(),
          api.getWishlist(),
        ]);
        setOrders(ordRes.orders);
        setWishlistProducts(wishRes.products);
      } catch (err) {
        console.error('Failed to load customer profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  if (!user) return null;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newStreet || !newCity || !newPostalCode) return;

    await addAddress({
      fullName: newFullName,
      phone: newPhone,
      street: newStreet,
      city: newCity,
      state: newState || 'Karnataka',
      postalCode: newPostalCode,
      country: 'India',
      isDefault: false,
    });

    setShowAddressModal(false);
    setNewFullName('');
    setNewPhone('');
    setNewStreet('');
    setNewCity('');
    setNewPostalCode('');
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-[#0B2419] text-white p-8 rounded-3xl shadow-2xl border border-[#163D2B] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#163D2B] border border-[#386641] flex items-center justify-center text-[#FDE68A] font-editorial text-2xl font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-3xl font-bold text-white">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="text-[10px] bg-[#163D2B] text-[#FDE68A] border border-[#386641]/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A8BFA5] font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-[#163D2B] hover:bg-[#386641] text-[#FDE68A] border border-[#386641]/50 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2.5 bg-[#163D2B]/50 hover:bg-red-950/40 text-red-300 border border-red-900/40 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#163D2B] pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#163D2B] text-[#FDE68A] border border-[#386641] shadow-md'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:text-white border border-[#163D2B] hover:bg-[#163D2B]/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-[#163D2B] text-[#FDE68A] border border-[#386641] shadow-md'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:text-white border border-[#163D2B] hover:bg-[#163D2B]/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-[#163D2B] text-[#FDE68A] border border-[#386641] shadow-md'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:text-white border border-[#163D2B] hover:bg-[#163D2B]/50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistProducts.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-[#0B2419] rounded-3xl p-12 text-center border border-[#163D2B] shadow-xl">
                <Package className="w-12 h-12 text-[#A8BFA5] mx-auto mb-3 stroke-[1.5]" />
                <h4 className="font-editorial text-2xl text-white">No Orders Yet</h4>
                <p className="text-xs text-[#A8BFA5] mt-1 mb-6">
                  You haven't placed any orders yet. Discover our forest-inspired pieces.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#163D2B] to-[#386641] text-white text-xs uppercase tracking-wider font-semibold rounded-xl inline-block shadow-md"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-[#0B2419] rounded-2xl p-6 border border-[#163D2B] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-[#FDE68A]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              : ord.orderStatus === 'shipped'
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                        <span className="text-xs text-[#A8BFA5]">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                        {ord.items.map((it, i) => (
                          <img
                            key={i}
                            src={it.image}
                            alt={it.name}
                            className="w-12 h-14 object-cover rounded-xl bg-[#071910] shrink-0 border border-[#163D2B]"
                            title={`${it.name} (${it.size})`}
                          />
                        ))}
                        <span className="text-xs text-[#A8BFA5] ml-2">
                          {ord.items.reduce((s, it) => s + it.quantity, 0)} items
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#163D2B]">
                      <div>
                        <span className="text-xs text-[#A8BFA5] block">Total Amount</span>
                        <span className="text-lg font-bold text-[#FDE68A]">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <Link
                        to={`/order-confirmation/${ord._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#A8BFA5] hover:text-[#FDE68A] transition-colors"
                      >
                        <span>View Tracking & Receipt</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#163D2B] to-[#386641] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md border border-[#386641]/50"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B] shadow-xl relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-white">{addr.fullName}</h4>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#163D2B] text-[#FDE68A] border border-[#386641]/50 px-2 py-0.5 rounded-full font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A8BFA5] leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state} - {addr.postalCode}<br />
                        Phone: {addr.phone}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#163D2B] flex justify-end">
                      <button
                        onClick={() => addr._id && deleteAddress(addr._id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-[#0B2419] rounded-2xl p-8 text-center text-xs text-[#A8BFA5] border border-[#163D2B]">
                  No saved addresses. Click "Add New Address" above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-[#0B2419] rounded-3xl p-12 text-center border border-[#163D2B] shadow-xl">
                <Heart className="w-12 h-12 text-[#A8BFA5] mx-auto mb-3" />
                <h4 className="font-editorial text-2xl text-white">Your Wishlist is Empty</h4>
                <p className="text-xs text-[#A8BFA5] mt-1 mb-6">
                  Save pieces you admire while browsing the collection.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#163D2B] to-[#386641] text-white text-xs uppercase tracking-wider font-semibold rounded-xl inline-block shadow-md"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B2419] border border-[#163D2B] rounded-3xl p-6 w-full max-w-md shadow-2xl text-[#F7F8F2]">
            <h3 className="font-editorial text-2xl text-white mb-4">Add Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-[#386641]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-[#386641]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-[#386641]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-[#386641]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-[#386641]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 bg-[#071910] hover:bg-[#163D2B]/40 text-[#A8BFA5] border border-[#163D2B] text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 text-xs font-semibold rounded-xl shadow-md transition-all"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
