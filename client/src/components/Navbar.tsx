import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';
import { MegaMenu } from './MegaMenu';
import { CATEGORY_TAXONOMY } from '../data/categoryTaxonomy';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, isAdmin, logout, wishlistCount } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setHoveredCategory(null);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    setExpandedMobileCategory(null);
  }, [location.pathname, location.search]);

  const handleMouseEnterCategory = (catKey: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategory(catKey);
  };

  const handleMouseLeaveCategory = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  const isTransparent = isHomePage && !isScrolled && !hoveredCategory;

  // Exact buttons requested by user: "Home, Mens, Womens, Kids, GenZ"
  const navLinks = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Mens', href: '/shop?category=Mens', id: 'mens' },
    { name: 'Womens', href: '/shop?category=Womens', id: 'womens' },
    { name: 'Kids', href: '/shop?category=Kids', id: 'kids' },
    { name: 'GenZ', href: '/shop?category=GenZ', id: 'genz' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isTransparent
            ? 'bg-[#071910]/40 backdrop-blur-md text-white border-b border-white/5 py-4'
            : 'bg-[#071910]/95 backdrop-blur-2xl text-[#F7F8F2] border-b border-[#163D2B]/90 shadow-2xl shadow-[#04120B]/90 py-3 nav-glow'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group transition-transform duration-300">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="KAADUGAL Brand Mark"
                  className="w-10 h-10 rounded-xl object-cover border border-[#386641]/50 shadow-lg group-hover:scale-105 group-hover:rotate-1 transition-all duration-500"
                />
                <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#386641] to-[#A8BFA5] opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-500 -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-2xl font-bold tracking-wider leading-tight text-white group-hover:text-[#FDE68A] transition-colors duration-300">
                  KAADUGAL
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-[#A8BFA5]">
                  Wear Your Roots
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links: ONLY "Home, Mens, Womens, Kids, GenZ" */}
            <nav className="hidden lg:flex items-center gap-2 text-sm font-medium tracking-wide">
              {navLinks.map((link) => {
                const searchCategory = new URLSearchParams(location.search).get('category')?.toLowerCase();
                const isHomeActive = link.name === 'Home' && location.pathname === '/' && !location.search;
                const isCatActive =
                  location.pathname === '/shop' &&
                  searchCategory &&
                  (searchCategory === link.name.toLowerCase() ||
                    (link.name === 'Mens' && searchCategory === 'men') ||
                    (link.name === 'Womens' && searchCategory === 'women'));

                const isActive = isHomeActive || isCatActive;
                const hasTaxonomy = link.id && link.id !== 'home' && CATEGORY_TAXONOMY[link.id];

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => hasTaxonomy && handleMouseEnterCategory(link.id)}
                    onMouseLeave={() => hasTaxonomy && handleMouseLeaveCategory()}
                  >
                    <Link
                      to={link.href}
                      className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium tracking-wide transition-all duration-300 ease-out group ${
                        isActive || hoveredCategory === link.id
                          ? 'text-[#FDE68A] font-semibold bg-[#163D2B]/90 shadow-inner border border-[#386641]/60 shadow-[0_0_12px_rgba(56,102,65,0.3)]'
                          : 'text-[#F7F8F2]/90 hover:text-white hover:bg-[#163D2B]/50 hover:scale-105 hover:shadow-[0_0_10px_rgba(56,102,65,0.2)]'
                      }`}
                    >
                      <span className="relative z-10">{link.name}</span>
                      {hasTaxonomy && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#A8BFA5] transition-transform duration-300 ${
                            hoveredCategory === link.id ? 'rotate-180 text-[#FDE68A]' : 'group-hover:translate-y-0.5'
                          }`}
                        />
                      )}
                      {isActive && (
                        <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-[#FDE68A] to-transparent rounded-full shadow-[0_0_6px_#FDE68A] animate-fade-in" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#386641] text-white text-[10px] font-bold flex items-center justify-center border border-white/20">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!user) {
                      setAuthOpen(true);
                    } else {
                      setAccountMenuOpen(!accountMenuOpen);
                    }
                  }}
                  className="p-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 hover:scale-105"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate text-[#A8BFA5]">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                </button>

                {/* Account Popover Menu */}
                {user && accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#0B2419] rounded-2xl shadow-2xl border border-[#163D2B] py-2 z-50 text-[#F7F8F2] animate-fade-in backdrop-blur-xl">
                    <div className="px-4 py-2.5 border-b border-[#163D2B]">
                      <p className="text-[11px] text-[#A8BFA5]">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-4 py-2.5 text-xs text-[#F7F8F2] hover:bg-[#163D2B] transition-colors"
                    >
                      My Profile & Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FDE68A] hover:bg-[#163D2B] transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/40 transition-colors border-t border-[#163D2B] mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-[#163D2B] to-[#386641] text-white hover:from-[#1b4833] hover:to-[#437a4e] transition-all shadow-md hover:scale-105 border border-[#386641]/50"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FDE68A] text-[#071910] text-[10px] font-extrabold flex items-center justify-center border-2 border-[#071910] shadow-sm animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hover Mega Menu for Desktop */}
        {hoveredCategory && CATEGORY_TAXONOMY[hoveredCategory] && (
          <MegaMenu
            category={CATEGORY_TAXONOMY[hoveredCategory]}
            isOpen={true}
            onClose={() => setHoveredCategory(null)}
            onMouseEnter={() => handleMouseEnterCategory(hoveredCategory)}
            onMouseLeave={handleMouseLeaveCategory}
          />
        )}

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071910]/98 backdrop-blur-2xl border-t border-[#163D2B] px-6 py-6 space-y-4 text-[#F7F8F2] shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto">
            <nav className="flex flex-col space-y-2 font-medium text-base">
              {navLinks.map((link) => {
                const taxonomy = link.id && link.id !== 'home' ? CATEGORY_TAXONOMY[link.id] : null;
                const isExpanded = expandedMobileCategory === link.id;

                if (!taxonomy) {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-3 rounded-xl hover:bg-[#163D2B] transition-colors flex items-center justify-between"
                    >
                      <span>{link.name}</span>
                      <span className="text-[#A8BFA5] text-xs">→</span>
                    </Link>
                  );
                }

                return (
                  <div key={link.name} className="border border-[#163D2B]/50 rounded-2xl overflow-hidden bg-[#0B2419]/50">
                    <div className="flex items-center justify-between p-3">
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-bold text-[#F7F8F2] hover:text-[#FDE68A] transition-colors flex-1"
                      >
                        {link.name}
                      </Link>
                      <button
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : link.id)}
                        className="p-1.5 text-[#A8BFA5] hover:text-white"
                        aria-label={`Toggle ${link.name} subcategories`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#FDE68A]' : ''}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-3 pt-1 space-y-1 bg-[#071910]/80 border-t border-[#163D2B]/50 animate-fade-in">
                        {taxonomy.products.map((item, iIdx) => (
                          <Link
                            key={iIdx}
                            to={`/shop?category=${encodeURIComponent(taxonomy.title)}&type=${encodeURIComponent(item.query)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-[#A8BFA5] hover:text-white py-1.5 px-2 rounded-lg hover:bg-[#163D2B]/60 flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#386641]" />
                              <span>{item.name}</span>
                            </span>
                            {item.badge && (
                              <span className="text-[9px] bg-[#163D2B] text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-[#163D2B]/50 font-bold text-[#FDE68A] flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </nav>

            <div className="pt-4 border-t border-[#163D2B] flex items-center justify-between text-xs text-[#A8BFA5]">
              {user ? (
                <span>Signed in as {user.name}</span>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-[#163D2B] hover:bg-[#386641] text-white rounded-xl font-medium transition-colors"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Popups */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};
