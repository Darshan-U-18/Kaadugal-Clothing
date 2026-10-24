import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  Tag,
  ShieldCheck,
  Search,
  Lock,
  Users,
  RefreshCw,
  CreditCard,
  Truck,
  ArrowUpRight,
  BarChart3,
  Layers,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, Order, Coupon } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, login, logout } = useAuth();

  // Admin login credentials state
  const [adminEmail, setAdminEmail] = useState('admin@admin.com');
  const [adminPassword, setAdminPassword] = useState('Kaadugal@2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Tabs: overview (Sales Dashboard), orders, products, coupons, customers
  const [activeTab, setActiveTab] = useState<'sales' | 'orders' | 'products' | 'coupons' | 'customers'>('sales');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');

  // New Product Modal
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState("Men's Collection");
  const [newProdPrice, setNewProdPrice] = useState<number>(1299);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(1799);
  const [newProdStock, setNewProdStock] = useState<number>(35);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMaterials, setNewProdMaterials] = useState('100% GOTS Certified Organic Cotton (240 GSM)');

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(15);
  const [newCouponMin, setNewCouponMin] = useState<number>(999);

  const loadAdminData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [statsRes, prodRes, ordRes, cpnRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts({ limit: 200 }),
        api.getAllOrders(),
        api.getAllCoupons(),
      ]);
      setStats(statsRes.stats);
      setProducts(prodRes.products || []);
      setOrders(ordRes.orders || []);
      setCoupons(cpnRes.coupons || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith('@admin.com')) {
      setLoginError('Admin access is strictly restricted to accounts ending with @admin.com (e.g. admin@admin.com or name@admin.com)');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      await login({ email: cleanEmail, password: adminPassword });
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsSubmittingAuth(false);
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
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Forest Green', hex: '#163D2B', inStock: true },
          { name: 'Deep Forest', hex: '#0B2419', inStock: true },
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
      setNewProdStock(35);
      setNewProdImage('');
      setNewProdDesc('');
      loadAdminData(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this garment from the active catalog?')) {
      await api.deleteProduct(id);
      loadAdminData(true);
    }
  };

  const handleUpdateStock = async (id: string, currentStock: number, delta: number) => {
    const updatedStock = Math.max(0, currentStock + delta);
    await api.updateProduct(id, { stock: updatedStock });
    loadAdminData(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await api.updateOrderStatus(orderId, { orderStatus: newStatus });
    loadAdminData(true);
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
    loadAdminData(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    await api.deleteCoupon(id);
    loadAdminData(true);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerEmail || '').toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  // If not logged in as Admin, show Admin Authorization Screen with @admin.com requirement
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#071910] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Subtle Forest Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071910] via-[#0B2419]/90 to-[#071910] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0B2419]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#386641]/50 text-[#F7F8F2] relative z-10 animate-fade-in">
          {/* Badge & Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#163D2B] to-[#386641] rounded-2xl flex items-center justify-center text-[#FDE68A] mx-auto mb-4 shadow-xl border border-emerald-500/30">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 mb-2">
              <Lock className="w-3 h-3" />
              <span>@admin.com Restricted Access</span>
            </div>
            <h2 className="font-editorial text-3xl text-[#F7F8F2]">KAADUGAL Atelier</h2>
            <p className="text-xs text-[#A8BFA5] mt-1 tracking-wider uppercase font-medium">
              Administrator Operations Dashboard
            </p>
          </div>

          {/* Explicit requirement explanation */}
          <div className="mb-6 p-3.5 bg-[#071910]/80 rounded-2xl border border-[#163D2B] text-xs text-[#A8BFA5] flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#FDE68A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Strict Domain Verification</span>
              Administrative access is strictly granted only to accounts with an email ending in{' '}
              <span className="font-mono font-bold text-[#FDE68A]">@admin.com</span>.
            </div>
          </div>

          {/* Notice if currently signed in with non-admin email */}
          {user && !isAdmin && (
            <div className="mb-5 p-3.5 bg-amber-950/50 border border-amber-600/50 rounded-2xl text-xs text-amber-200">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Signed in as Customer: {user.email}</span>
              </div>
              <p className="text-[11px] text-amber-200/80 mb-2">
                This account does not end with <span className="font-mono text-white">@admin.com</span> and does not have administrative privileges.
              </p>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] font-semibold text-[#FDE68A] underline hover:text-white"
              >
                Sign out of current account
              </button>
            </div>
          )}

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-950/70 border border-red-500/50 text-red-200 text-xs rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                Admin Email (Must end with @admin.com)
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="yourname@admin.com"
                className="w-full px-4 py-3 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-[#F7F8F2] placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 border border-[#386641]/50"
            >
              <ShieldCheck className="w-4 h-4 text-[#FDE68A]" />
              <span>{isSubmittingAuth ? 'Verifying Credentials...' : 'Authenticate Admin Access'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#163D2B] text-center">
            <span className="text-[11px] text-[#A8BFA5]/70 block">
              Default administrator account: <span className="font-mono text-[#FDE68A]">admin@admin.com</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Operational Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-[#163D2B]/50 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Verified Administrator • @admin.com
              </span>
              <span className="text-xs text-[#A8BFA5] font-mono">
                {user?.email}
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#F7F8F2] tracking-wide">
              Operations & Sales Dashboard
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => loadAdminData(true)}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 bg-[#0B2419] hover:bg-[#163D2B] text-[#A8BFA5] hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider border border-[#163D2B] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh live store data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FDE68A]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md flex items-center gap-2 border border-emerald-500/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FDE68A]" />
              <span>New Garment</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-semibold uppercase tracking-wider border border-red-800/40 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#163D2B]/40 scrollbar-none">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-lg'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/50 border border-[#163D2B]/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#FDE68A]" />
            <span>Sales & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-lg'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/50 border border-[#163D2B]/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-lg'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/50 border border-[#163D2B]/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-lg'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/50 border border-[#163D2B]/50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Offers ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#163D2B] text-white border border-emerald-500/40 shadow-lg'
                : 'bg-[#0B2419] text-[#A8BFA5] hover:bg-[#163D2B]/50 border border-[#163D2B]/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({stats?.totalCustomers || 0})</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#FDE68A] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-wider text-[#A8BFA5]">Loading atelier operations data...</p>
          </div>
        )}

        {/* TAB 1: TOTAL SALES & ANALYTICS DASHBOARD */}
        {!isLoading && activeTab === 'sales' && stats && (
          <div className="space-y-8 animate-fade-in">
            {/* 6 Top Primary Sales KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* 1. Total Sales */}
              <div className="bg-[#0B2419] p-5 rounded-2xl border border-emerald-600/30 shadow-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-12 h-12 text-[#FDE68A]" />
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                  Total Sales
                </span>
                <span className="font-editorial text-3xl font-bold text-[#FDE68A] block">
                  ₹{Number(stats.totalSales || stats.totalRevenue || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-400 font-medium block mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Live Net Store Sales
                </span>
              </div>

              {/* 2. Total Orders */}
              <div className="bg-[#0B2419] p-5 rounded-2xl border border-[#163D2B]/60 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                  Total Orders
                </span>
                <span className="font-editorial text-3xl font-bold text-white block">
                  {stats.totalOrders}
                </span>
                <span className="text-[11px] text-[#A8BFA5] block mt-1">
                  {stats.statusCounts.shipped + stats.statusCounts.delivered} fulfilled
                </span>
              </div>

              {/* 3. Average Order Value (AOV) */}
              <div className="bg-[#0B2419] p-5 rounded-2xl border border-[#163D2B]/60 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                  Avg. Order Value
                </span>
                <span className="font-editorial text-3xl font-bold text-white block">
                  ₹{Number(stats.averageOrderValue || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-400/90 block mt-1">
                  Revenue per checkout
                </span>
              </div>

              {/* 4. Garments Dispatched */}
              <div className="bg-[#0B2419] p-5 rounded-2xl border border-[#163D2B]/60 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                  Garments Sold
                </span>
                <span className="font-editorial text-3xl font-bold text-white block">
                  {stats.totalGarmentsSold || 0}
                </span>
                <span className="text-[11px] text-[#A8BFA5] block mt-1">
                  Units shipped to buyers
                </span>
              </div>

              {/* 5. Inventory Pieces */}
              <div className="bg-[#0B2419] p-5 rounded-2xl border border-[#163D2B]/60 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                  Catalog Pieces
                </span>
                <span className="font-editorial text-3xl font-bold text-white block">
                  {stats.totalProducts}
                </span>
                <span className="text-[11px] text-[#A8BFA5] block mt-1">
                  4 Forest Collections
                </span>
              </div>

              {/* 6. Total Customers */}
              <div className="bg-[#0B2419] p-5 rounded-2xl border border-[#163D2B]/60 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#A8BFA5] font-semibold block mb-1">
                  Registered Shoppers
                </span>
                <span className="font-editorial text-3xl font-bold text-white block">
                  {stats.totalCustomers}
                </span>
                <span className="text-[11px] text-[#A8BFA5] block mt-1">
                  Non-admin members
                </span>
              </div>
            </div>

            {/* Middle Grid: Category Sales Breakdown & Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Sales Distribution */}
              <div className="lg:col-span-2 bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/60 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-editorial text-2xl text-white">Sales by Garment Category</h3>
                    <p className="text-xs text-[#A8BFA5]">Revenue generation across forest wear collections</p>
                  </div>
                  <Layers className="w-5 h-5 text-[#FDE68A]" />
                </div>

                <div className="space-y-4">
                  {stats.categorySales && stats.categorySales.length > 0 ? (
                    stats.categorySales.map((cat: any) => (
                      <div key={cat.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{cat.category}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[#A8BFA5]">{cat.unitsSold} units</span>
                            <span className="font-bold text-[#FDE68A]">
                              ₹{cat.revenue.toLocaleString('en-IN')}
                            </span>
                            <span className="font-mono text-[11px] text-emerald-400 w-10 text-right">
                              {cat.percentage}%
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-[#071910] rounded-full h-2.5 overflow-hidden border border-[#163D2B]">
                          <div
                            className="bg-gradient-to-r from-[#163D2B] via-[#386641] to-emerald-400 h-2.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(6, cat.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#A8BFA5] py-4">No category sales recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Payment Methods & Pipeline */}
              <div className="space-y-6">
                {/* Payment Breakdown Card */}
                <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/60 shadow-sm">
                  <h3 className="font-editorial text-xl text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#FDE68A]" />
                    <span>Payment Channels</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#071910] rounded-xl border border-[#163D2B] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Razorpay Online</span>
                        <span className="text-[11px] text-[#A8BFA5]">UPI, Cards, NetBanking</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-[#FDE68A] block">
                          ₹{(stats.paymentMethods?.razorpay?.revenue || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-400">
                          {stats.paymentMethods?.razorpay?.count || 0} orders
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#071910] rounded-xl border border-[#163D2B] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-[#A8BFA5]">Pay on receipt</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-amber-300 block">
                          ₹{(stats.paymentMethods?.cod?.revenue || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-amber-400/80">
                          {stats.paymentMethods?.cod?.count || 0} orders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispatch Status Pipeline */}
                <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/60 shadow-sm">
                  <h3 className="font-editorial text-xl text-white mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#FDE68A]" />
                    <span>Fulfillment Pipeline</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-[#071910] rounded-xl border border-[#163D2B]">
                      <span className="text-[10px] uppercase text-[#A8BFA5] block">Processing</span>
                      <span className="text-lg font-bold text-amber-300">{stats.statusCounts.processing}</span>
                    </div>
                    <div className="p-2.5 bg-[#071910] rounded-xl border border-[#163D2B]">
                      <span className="text-[10px] uppercase text-[#A8BFA5] block">In Transit</span>
                      <span className="text-lg font-bold text-blue-300">{stats.statusCounts.shipped}</span>
                    </div>
                    <div className="p-2.5 bg-[#071910] rounded-xl border border-[#163D2B]">
                      <span className="text-[10px] uppercase text-[#A8BFA5] block">Delivered</span>
                      <span className="text-lg font-bold text-emerald-300">{stats.statusCounts.delivered}</span>
                    </div>
                    <div className="p-2.5 bg-[#071910] rounded-xl border border-[#163D2B]">
                      <span className="text-[10px] uppercase text-[#A8BFA5] block">New Unprocessed</span>
                      <span className="text-lg font-bold text-white">{stats.statusCounts.ordered}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Top Selling Garments & Low Stock Warnings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Garments */}
              <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-editorial text-2xl text-white">Top Performing Garments</h3>
                  <span className="text-xs text-[#A8BFA5] font-semibold">Ranked by volume</span>
                </div>

                <div className="divide-y divide-[#163D2B]/40">
                  {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                    stats.topSellingProducts.map((p: any, idx: number) => (
                      <div key={p.id || idx} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#071910] border border-[#163D2B] flex items-center justify-center text-xs font-bold text-[#FDE68A]">
                            #{idx + 1}
                          </span>
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-[#163D2B]"
                            />
                          )}
                          <div>
                            <span className="font-semibold text-xs text-white block truncate max-w-[220px]">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-[#A8BFA5]">
                              {p.unitsSold} units dispatched
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xs text-[#FDE68A] block">
                            ₹{p.revenue.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-400">Total Revenue</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#A8BFA5] py-4">No top product sales recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-[#0B2419] p-6 rounded-2xl border border-amber-900/40 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-editorial text-2xl text-white">Low Inventory Alert</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-bold">
                    {stats.lowStockCount} Items Low
                  </span>
                </div>

                <div className="divide-y divide-[#163D2B]/40">
                  {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                    stats.lowStockProducts.slice(0, 5).map((p: any) => (
                      <div key={p._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-[#163D2B]"
                          />
                          <div>
                            <span className="font-semibold text-xs text-white block truncate max-w-[200px]">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-amber-400 font-medium">
                              Only {p.stock} units left in atelier
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdateStock(p._id, p.stock, 10)}
                          className="px-2.5 py-1.5 bg-[#163D2B] hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30 transition-all cursor-pointer whitespace-nowrap"
                        >
                          +10 Restock
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-400 py-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> All garment catalog levels are well-stocked!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {!isLoading && activeTab === 'orders' && (
          <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/60 overflow-hidden shadow-sm animate-fade-in">
            {/* Header & Filter Controls */}
            <div className="p-5 border-b border-[#163D2B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial text-2xl text-white">Live Customer Orders</h3>
                <p className="text-xs text-[#A8BFA5]">Real-time orders, payment receipts & delivery dispatches</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#A8BFA5] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order ID, Customer..."
                    className="pl-8 pr-3 py-1.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-[#A8BFA5]/50 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Status Dropdown Filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="ordered">Ordered</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#071910] text-[#A8BFA5] uppercase tracking-wider font-semibold border-b border-[#163D2B]/40">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Garments Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Live Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#163D2B]/30">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#163D2B]/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#FDE68A] block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-[#A8BFA5]">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{ord.customerName}</span>
                          <span className="text-[11px] text-[#A8BFA5] block">{ord.customerEmail}</span>
                          {ord.shippingAddress?.city && (
                            <span className="text-[10px] text-emerald-400">
                              {ord.shippingAddress.city}, {ord.shippingAddress.state}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#A8BFA5]">
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="font-medium text-white">{it.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-[#071910] rounded text-[#FDE68A]">
                                  {it.size} x{it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-editorial text-base font-bold text-[#FDE68A] block">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </span>
                          {ord.discount > 0 && (
                            <span className="text-[10px] text-emerald-400 block">
                              Saved ₹{ord.discount} ({ord.couponCode || 'Promo'})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-block ${
                              ord.paymentStatus === 'completed'
                                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                                : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="px-2.5 py-1.5 bg-[#071910] border border-[#163D2B] rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="ordered">Ordered</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#A8BFA5]">
                        No customer orders matched your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY */}
        {!isLoading && activeTab === 'products' && (
          <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/60 overflow-hidden shadow-sm animate-fade-in">
            <div className="p-5 border-b border-[#163D2B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial text-2xl text-white">Garment Catalog & Inventory</h3>
                <p className="text-xs text-[#A8BFA5]">Manage prices, stock levels and live atelier collections</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#A8BFA5] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search garments..."
                    className="pl-8 pr-3 py-1.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-[#A8BFA5]/50 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-3.5 py-1.5 bg-[#163D2B] hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl uppercase tracking-wider border border-emerald-500/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  + Add Piece
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#071910] text-[#A8BFA5] uppercase tracking-wider font-semibold border-b border-[#163D2B]/40">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Control</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#163D2B]/30">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-[#163D2B]/20 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded-lg bg-[#071910] border border-[#163D2B]/50 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-white block">{p.name}</span>
                          <span className="text-[11px] text-[#A8BFA5]">{p.sizes.join(', ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#A8BFA5] font-medium">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#FDE68A] block">₹{p.price.toLocaleString('en-IN')}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-[#A8BFA5]/60 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(p._id, p.stock, -5)}
                            className="w-6 h-6 rounded bg-[#071910] hover:bg-[#163D2B] border border-[#163D2B] text-white font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              p.stock < 15
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                : 'text-white'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleUpdateStock(p._id, p.stock, 5)}
                            className="w-6 h-6 rounded bg-[#071910] hover:bg-[#163D2B] border border-[#163D2B] text-white font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {p.stock > 0 ? (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300">
                            Sold Out
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1.5 cursor-pointer rounded-lg hover:bg-red-950/30"
                          title="Delete garment"
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

        {/* TAB 4: COUPONS & DISCOUNTS */}
        {!isLoading && activeTab === 'coupons' && (
          <div className="space-y-8 animate-fade-in">
            {/* Create Promo Code Box */}
            <div className="bg-[#0B2419] p-6 rounded-2xl border border-[#163D2B]/60 shadow-sm">
              <h3 className="font-editorial text-2xl text-white mb-2">Create New Promotion</h3>
              <p className="text-xs text-[#A8BFA5] mb-5">Generate promotional discount coupons for seasonal campaigns</p>
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
                    placeholder="E.g. MONSOON20"
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs uppercase text-white placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={90}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Min Cart Order (₹)
                  </label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#163D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border border-emerald-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FDE68A]" />
                    <span>Generate Code</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/60 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#163D2B]/40">
                <h3 className="font-editorial text-2xl text-white">Active Promotional Codes</h3>
              </div>
              <div className="divide-y divide-[#163D2B]/30">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 flex items-center justify-between hover:bg-[#163D2B]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-[#FDE68A]" />
                      <div>
                        <span className="font-mono text-sm font-bold text-[#FDE68A]">{c.code}</span>
                        <p className="text-xs text-[#A8BFA5]">
                          {c.discountAmount}% off on minimum cart order of ₹{c.minPurchase || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-emerald-400 font-medium">Used {c.usedCount || 0} times</span>
                      <button
                        onClick={() => handleDeleteCoupon(c._id || c.code)}
                        className="text-red-400 hover:text-red-300 p-1.5 cursor-pointer rounded-lg hover:bg-red-950/40"
                        title="Delete promo code"
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

        {/* TAB 5: REGISTERED CUSTOMERS DIRECTORY */}
        {!isLoading && activeTab === 'customers' && stats?.customerList && (
          <div className="bg-[#0B2419] rounded-2xl border border-[#163D2B]/60 overflow-hidden shadow-sm animate-fade-in">
            <div className="p-5 border-b border-[#163D2B]/40">
              <h3 className="font-editorial text-2xl text-white">Registered Customer Directory</h3>
              <p className="text-xs text-[#A8BFA5]">Active community members & patrons (Excludes administrators)</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#071910] text-[#A8BFA5] uppercase tracking-wider font-semibold border-b border-[#163D2B]/40">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Saved Addresses</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#163D2B]/30">
                  {stats.customerList.map((cust: any) => (
                    <tr key={cust._id} className="hover:bg-[#163D2B]/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {cust.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400">
                        {cust.email}
                      </td>
                      <td className="py-3.5 px-4 text-[#A8BFA5]">
                        {cust.addressesCount || 0} addresses on file
                      </td>
                      <td className="py-3.5 px-4 text-[#A8BFA5]">
                        {cust.createdAt
                          ? new Date(cust.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B2419] border border-[#163D2B]/80 text-[#F7F8F2] rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-editorial text-2xl text-white mb-1">Add Garment to Atelier</h3>
            <p className="text-xs text-[#A8BFA5] mb-5">Publish a newly crafted botanical piece to the store</p>

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
                  className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                    Collection Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    min={0}
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  High-Resolution Image URL
                </label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000"
                  className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Garment Description
                </label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Silhouette details, natural drape, and botanical dye origins..."
                  className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1">
                  Materials & GSM Specifications
                </label>
                <input
                  type="text"
                  value={newProdMaterials}
                  onChange={(e) => setNewProdMaterials(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-[#A8BFA5]/40 focus:outline-none focus:border-emerald-500"
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
                  className="flex-1 py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-emerald-500/30 cursor-pointer shadow-md"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
