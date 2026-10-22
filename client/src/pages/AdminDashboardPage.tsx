import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Tag,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, Order, Coupon } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, login } = useAuth();

  // Admin login state if not logged in as admin
  const [adminEmail, setAdminEmail] = useState('admin@kaadugal.com');
  const [adminPassword, setAdminPassword] = useState('Kaadugal@2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Product Modal
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState("Men's Collection");
  const [newProdPrice, setNewProdPrice] = useState<number>(1299);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(1799);
  const [newProdStock, setNewProdStock] = useState<number>(30);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMaterials, setNewProdMaterials] = useState('100% GOTS Certified Organic Cotton (240 GSM)');

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(15);
  const [newCouponMin, setNewCouponMin] = useState<number>(999);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, prodRes, ordRes, cpnRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts({ limit: 100 }),
        api.getAllOrders(),
        api.getAllCoupons(),
      ]);
      setStats(statsRes.stats);
      setProducts(prodRes.products);
      setOrders(ordRes.orders);
      setCoupons(cpnRes.coupons);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await login({ email: adminEmail, password: adminPassword });
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    try {
      await api.createProduct({
        name: newProdName,
        category: newProdCategory,
        price: Number(newProdPrice),
        originalPrice: Number(newProdOriginalPrice),
        stock: Number(newProdStock),
        images: [
          newProdImage ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Forest Green', hex: '#163D2B', inStock: true },
          { name: 'Sage Green', hex: '#A8BFA5', inStock: true },
        ],
        description: newProdDesc || 'Premium organic garment tailored with high-density cotton fibers.',
        materials: newProdMaterials,
        isFeatured: true,
        isNewArrival: true,
      });

      setShowProductModal(false);
      setNewProdName('');
      setNewProdPrice(1299);
      setNewProdStock(30);
      setNewProdImage('');
      setNewProdDesc('');
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this garment from the active catalog?')) {
      await api.deleteProduct(id);
      loadAdminData();
    }
  };

  const handleUpdateStock = async (id: string, currentStock: number, delta: number) => {
    const updatedStock = Math.max(0, currentStock + delta);
    await api.updateProduct(id, { stock: updatedStock });
    loadAdminData();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await api.updateOrderStatus(orderId, { orderStatus: newStatus });
    loadAdminData();
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    await api.createCoupon({
      code: newCouponCode,
      discountType: 'percentage',
      discountAmount: Number(newCouponDiscount),
      minPurchase: Number(newCouponMin),
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    });

    setNewCouponCode('');
    loadAdminData();
  };

  const handleDeleteCoupon = async (id: string) => {
    await api.deleteCoupon(id);
    loadAdminData();
  };

  // If not logged in as Admin, show Admin Authorization Screen
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#071910] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0B2419] rounded-3xl p-8 shadow-2xl border border-[#163D2B]/60 text-[#F7F8F2]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#163D2B] rounded-2xl flex items-center justify-center text-[#FDE68A] mx-auto mb-3 shadow-md border border-emerald-600/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-editorial text-3xl text-[#F7F8F2]">KAADUGAL Atelier</h2>
            <p className="text-xs text-[#A8BFA5] mt-1 tracking-wider uppercase">Administrator Management Console</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@kaadugal.com"
                className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#163D2B] hover:bg-emerald-800 text-white rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer"
            >
              Authenticate Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#163D2B]/40 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#FDE68A] font-bold">
              Management Portal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#F7F8F2]">
              KAADUGAL Operations Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2.5 bg-[#163D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </button>
          </div>
        </div>

        {/* Metric Cards (Overview) */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/50 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                Total Revenue
              </span>
              <span className="font-editorial text-3xl font-bold text-[#FDE68A]">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-400 block mt-1 font-medium">
                Live Sales across all channels
              </span>
            </div>

            <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/50 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                Total Orders
              </span>
              <span className="font-editorial text-3xl font-bold text-[#F7F8F2]">
                {stats.totalOrders}
              </span>
              <span className="text-[11px] text-[#A8BFA5] block mt-1">
                {stats.statusCounts.processing} processing, {stats.statusCounts.shipped} in transit
              </span>
            </div>

            <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/50 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                Catalog Pieces
              </span>
              <span className="font-editorial text-3xl font-bold text-[#F7F8F2]">
                {stats.totalProducts}
              </span>
              <span className="text-[11px] text-[#A8BFA5] block mt-1">Across 4 forest categories</span>
            </div>

            <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/50 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                Low Inventory
              </span>
              <span className="font-editorial text-3xl font-bold text-amber-400">
                {stats.lowStockCount}
              </span>
              <span className="text-[11px] text-amber-400/90 block mt-1 font-medium">
                Garments with &lt; 15 units
              </span>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#163D2B]/40 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-sm'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/40 border border-[#163D2B]/50'
            }`}
          >
            Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-sm'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/40 border border-[#163D2B]/50'
            }`}
          >
            Product Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-sm'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/40 border border-[#163D2B]/50'
            }`}
          >
            Promotions & Coupons ({coupons.length})
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'overview' && (
          <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/50 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#163D2B]/40 flex items-center justify-between">
              <h3 className="font-editorial text-2xl text-[#F7F8F2]">Customer Orders</h3>
              <span className="text-xs text-[#A8BFA5] font-mono">
                {orders.length} Total Orders Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#071910] text-[#A8BFA5] uppercase tracking-wider font-semibold border-b border-[#163D2B]/40">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Garments</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#163D2B]/30">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#163D2B]/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#FDE68A]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block text-[#F7F8F2]">{ord.customerName}</span>
                        <span className="text-[#A8BFA5] text-[11px]">{ord.customerEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A8BFA5]">
                        {ord.items.map((it) => `${it.name} (${it.size} x${it.quantity})`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#F7F8F2]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            ord.paymentStatus === 'completed'
                              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                              : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                          }`}
                        >
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="px-2.5 py-1.5 bg-[#071910] border border-[#163D2B] rounded-lg text-xs font-semibold text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                        >
                          <option value="ordered">Ordered</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog Management */}
        {activeTab === 'products' && (
          <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/50 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#163D2B]/40 flex items-center justify-between">
              <h3 className="font-editorial text-2xl text-[#F7F8F2]">Garment Inventory</h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="px-3 py-1.5 bg-[#163D2B] hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg uppercase tracking-wider border border-emerald-500/30 transition-all cursor-pointer"
              >
                + Add Piece
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#071910] text-[#A8BFA5] uppercase tracking-wider font-semibold border-b border-[#163D2B]/40">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Units</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#163D2B]/30">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-[#163D2B]/20 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded-lg bg-[#071910] border border-[#163D2B]/50"
                        />
                        <div>
                          <span className="font-semibold text-[#F7F8F2] block">{p.name}</span>
                          <span className="text-[11px] text-[#A8BFA5]">{p.sizes.join(', ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#A8BFA5] font-medium">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-[#FDE68A]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(p._id, p.stock, -5)}
                            className="w-6 h-6 rounded bg-[#071910] hover:bg-[#163D2B] border border-[#163D2B] text-[#F7F8F2] font-bold"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded ${
                              p.stock < 15
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                : 'text-[#F7F8F2]'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleUpdateStock(p._id, p.stock, 5)}
                            className="w-6 h-6 rounded bg-[#071910] hover:bg-[#163D2B] border border-[#163D2B] text-[#F7F8F2] font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
                          title="Delete piece"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Coupons Management */}
        {activeTab === 'coupons' && (
          <div className="space-y-8">
            {/* Create Coupon Box */}
            <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/50 shadow-sm">
              <h3 className="font-editorial text-2xl text-[#F7F8F2] mb-4">Create Promo Code</h3>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="E.g. WILD25"
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs uppercase text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#163D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border border-emerald-500/30 cursor-pointer"
                  >
                    Generate Coupon
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/50 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#163D2B]/40">
                <h3 className="font-editorial text-2xl text-[#F7F8F2]">Active Promotions</h3>
              </div>
              <div className="divide-y divide-[#163D2B]/30">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-[#FDE68A]" />
                      <div>
                        <span className="font-mono text-sm font-bold text-[#FDE68A]">{c.code}</span>
                        <p className="text-xs text-[#A8BFA5]">
                          {c.discountAmount}% Discount on minimum order of ₹{c.minPurchase || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#A8BFA5]">Used {c.usedCount || 0} times</span>
                      <button
                        onClick={() => handleDeleteCoupon(c._id || c.code)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B2419] border border-[#163D2B]/60 text-[#F7F8F2] rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-editorial text-2xl text-[#F7F8F2] mb-4">Add Garment to Catalog</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Canopy Linen Kimono Cardigan"
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Men's Collection">Men's Collection</option>
                    <option value="Women's Collection">Women's Collection</option>
                    <option value="Kids Collection">Kids Collection</option>
                    <option value="GenZ Streetwear">GenZ Streetwear</option>
                    <option value="Oversized Tees">Oversized Tees</option>
                    <option value="Everyday Essentials">Everyday Essentials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Initial Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  High-Res Image URL
                </label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000"
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Garment silhouette, drape, and botanical dye origins..."
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Materials & GSM
                </label>
                <input
                  type="text"
                  value={newProdMaterials}
                  onChange={(e) => setNewProdMaterials(e.target.value)}
                  className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 bg-[#071910] hover:bg-[#163D2B] border border-[#163D2B] text-[#A8BFA5] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#163D2B] hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-emerald-500/30 cursor-pointer"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
