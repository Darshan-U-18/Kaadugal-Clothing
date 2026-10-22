import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { SmartSizeFinderModal } from '../components/SmartSizeFinderModal';
import { ReviewModal } from '../components/ReviewModal';

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isSizeFinderOpen, setIsSizeFinderOpen] = useState<boolean>(false);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { user, isInWishlist, toggleWishlist } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!idOrSlug) return;
      setIsLoading(true);
      window.scrollTo(0, 0);

      try {
        const res = await api.getProduct(idOrSlug);
        const prod = res.product;
        setProduct(prod);
        setSelectedImage(prod.images[0] || '');

        let initialSize = prod.sizes[0] || 'M';
        try {
          const savedProfile = localStorage.getItem('kaadugal_fit_profile');
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.recommendedSize) {
              setRecommendedSize(parsed.recommendedSize);
              if (prod.sizes.includes(parsed.recommendedSize)) {
                initialSize = parsed.recommendedSize;
              }
            }
          }
        } catch {
          // ignore
        }

        setSelectedSize(initialSize);
        setSelectedColor((prod.colors && prod.colors[0]?.name) || 'Forest Green');
        setQuantity(1);

        // Fetch related products & reviews in parallel
        const [relRes, revRes] = await Promise.all([
          api.getRelatedProducts(prod._id),
          api.getReviews(prod._id),
        ]);
        setRelatedProducts(relRes.products);
        setReviews(revRes.reviews);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [idOrSlug]);

  const reloadReviews = async () => {
    if (!product) return;
    try {
      const [revRes, prodRes] = await Promise.all([
        api.getReviews(product._id),
        api.getProduct(product._id),
      ]);
      if (revRes && Array.isArray(revRes.reviews)) {
        setReviews(revRes.reviews);
      }
      if (prodRes && prodRes.product) {
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                rating: prodRes.product.rating,
                numReviews: prodRes.product.numReviews,
              }
            : prodRes.product
        );
      }
    } catch (err) {
      console.error('Failed to reload dynamic reviews:', err);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="pt-32 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-6 bg-gray-200 rounded-lg w-1/4" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const dynamicRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating;
  const dynamicNumReviews = reviews.length > 0 ? reviews.length : product.numReviews;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#071910] text-[#F7F8F2]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#A8BFA5] flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#FDE68A] font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery (Thumbs + Main View) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 sm:w-full sm:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                    selectedImage === img
                      ? 'border-[#386641] shadow-lg scale-95 ring-2 ring-[#386641]/50'
                      : 'border-[#163D2B] opacity-60 hover:opacity-100 hover:border-[#386641]/50'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    onError={(e) => {
                      const cat = (product.category || '').toLowerCase();
                      e.currentTarget.src = cat.includes('women')
                        ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
                        : cat.includes('kid')
                        ? 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80'
                        : cat.includes('gen')
                        ? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
                        : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Main Featured Image with Subtle Zoom Hover */}
            <div className="flex-1 aspect-[3/4] max-h-[580px] rounded-3xl overflow-hidden bg-[#0B2419] shadow-2xl border border-[#163D2B] relative group">
              <img
                src={selectedImage}
                alt={product.name}
                onError={(e) => {
                  const cat = (product.category || '').toLowerCase();
                  e.currentTarget.src = cat.includes('women')
                    ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
                    : cat.includes('kid')
                    ? 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80'
                    : cat.includes('gen')
                    ? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
                    : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {product.discountPercent && product.discountPercent > 0 ? (
                <span className="absolute top-4 left-4 bg-[#071910]/90 backdrop-blur-md text-[#FDE68A] border border-[#386641]/50 text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-lg">
                  {product.discountPercent}% OFF
                </span>
              ) : null}
            </div>
          </div>

          {/* Right: Details & Purchase Options */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center text-[#FDE68A]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(dynamicRating)
                            ? 'fill-[#FDE68A] text-[#FDE68A]'
                            : 'text-[#163D2B]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">{dynamicRating.toFixed(1)}</span>
                  <a href="#reviews" className="text-[#A8BFA5] hover:text-[#FDE68A] underline transition-colors">
                    ({dynamicNumReviews} reviews)
                  </a>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#163D2B]">
                <span className="text-3xl font-extrabold text-[#FDE68A]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-[#A8BFA5]/60 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-[#A8BFA5] bg-[#163D2B]/80 border border-[#386641]/40 px-2.5 py-1 rounded-md font-medium">
                  Tax Included
                </span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-[#A8BFA5] font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-2.5">
                    Color: <span className="font-normal text-white">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          selectedColor === c.name
                            ? 'border-[#FDE68A] scale-110 shadow-[0_0_10px_rgba(253,230,138,0.4)]'
                            : 'border-transparent hover:border-[#163D2B]'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full shadow-sm border border-white/20"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#A8BFA5]">
                    Select Size
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSizeFinderOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#FDE68A] hover:text-white font-medium transition-all bg-[#163D2B] hover:bg-[#1b4833] px-2.5 py-1 rounded-lg border border-[#386641] hover:border-[#FDE68A]/60 shadow-sm"
                      title="No measuring tape needed — 3 quick questions"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span className="font-semibold">Find My Size in 10s</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 text-xs text-[#A8BFA5] hover:text-[#FDE68A] font-medium transition-colors"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  {product.sizes.map((sz) => {
                    const isRecommended = sz === recommendedSize;
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`relative py-3 text-xs font-semibold rounded-xl border transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#163D2B] text-[#FDE68A] border-[#FDE68A]/60 shadow-md ring-1 ring-[#FDE68A]/30'
                            : 'bg-[#0B2419] hover:bg-[#163D2B]/50 text-[#F7F8F2] border-[#163D2B]'
                        }`}
                      >
                        {sz}
                        {isRecommended && (
                          <span
                            className="absolute -top-2 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#386641] text-[#FDE68A] border border-[#FDE68A]/40 flex items-center gap-0.5 shadow-sm"
                            title="Recommended based on your fit profile"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Fit</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {recommendedSize && (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#A8BFA5] bg-[#071910] border border-[#163D2B] px-3.5 py-2 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>
                        Recommended for you: <strong className="text-[#FDE68A]">Size {recommendedSize}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSizeFinderOpen(true)}
                      className="text-xs text-[#A8BFA5] hover:text-[#FDE68A] underline transition-colors"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>

              {/* Quantity Controls & Stock Notice */}
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[#163D2B] rounded-xl bg-[#0B2419] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#A8BFA5] hover:text-white rounded-lg transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 text-[#A8BFA5] hover:text-white rounded-lg transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  {product.stock > 0 ? (
                    <span className="text-xs text-[#A8BFA5] bg-[#163D2B]/80 border border-[#386641]/50 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>{product.stock > 10 ? 'In Stock Ready to Ship' : `Only ${product.stock} units remaining`}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-red-300 bg-red-950/60 border border-red-800 px-3 py-1.5 rounded-lg font-medium">
                      Temporarily Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Buttons (Add to Bag, Buy Now, Wishlist) */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-4 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl font-medium text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-4 rounded-xl border border-[#163D2B] bg-[#0B2419] transition-all hover:scale-105 ${
                      isFavorited
                        ? 'text-red-400 border-red-800 bg-red-950/30'
                        : 'text-[#A8BFA5] hover:text-white'
                    }`}
                    title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-400 text-red-400' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 bg-[#0B2419] hover:bg-[#163D2B] text-[#F7F8F2] border border-[#163D2B] hover:border-[#386641] rounded-xl font-medium text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
                >
                  Buy It Now
                </button>
              </div>
            </div>

            {/* Service Perks */}
            <div className="mt-8 pt-6 border-t border-[#163D2B] grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-[#A8BFA5]" />
                <span className="text-[11px] font-semibold text-white">Free Shipping</span>
                <span className="text-[10px] text-[#A8BFA5]">Over ₹1,500</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-[#A8BFA5]" />
                <span className="text-[11px] font-semibold text-white">14-Day Returns</span>
                <span className="text-[10px] text-[#A8BFA5]">Hassle-free</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-[#A8BFA5]" />
                <span className="text-[11px] font-semibold text-white">Pure Organic</span>
                <span className="text-[10px] text-[#A8BFA5]">GOTS Certified</span>
              </div>
            </div>
          </div>
        </div>


        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-16 bg-[#0B2419] rounded-3xl p-8 border border-[#163D2B] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#163D2B] gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
                Community Feedback
              </span>
              <h3 className="font-editorial text-3xl text-white mt-1">Customer Reviews</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-[#FDE68A]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(dynamicRating)
                          ? 'fill-[#FDE68A] text-[#FDE68A]'
                          : 'text-[#163D2B]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">{dynamicRating.toFixed(1)} / 5</span>
                <span className="text-xs text-[#A8BFA5]">Based on {dynamicNumReviews} authentic reviews</span>
              </div>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md border border-[#386641]/50"
            >
              Write a Review
            </button>
          </div>

          <div className="pt-8 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="pb-6 border-b border-[#163D2B] last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-[#A8BFA5] bg-[#163D2B] border border-[#386641]/50 px-2 py-0.5 rounded-full font-medium">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#A8BFA5]/70">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#FDE68A] mb-2">
                    {[...Array(rev.rating)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#FDE68A] text-[#FDE68A]" />
                    ))}
                  </div>

                  {rev.title && <h5 className="text-sm font-semibold text-white mb-1">{rev.title}</h5>}
                  <p className="text-xs text-[#A8BFA5] font-light leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#A8BFA5] text-center py-6">
                Be the first to share your journey with this garment.
              </p>
            )}
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA5] font-bold">
                Harmonious Pairings
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl text-white mt-1">
                Complete the Look
              </h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Popups */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onOpenSizeFinder={() => setIsSizeFinderOpen(true)}
      />
      <SmartSizeFinderModal
        isOpen={isSizeFinderOpen}
        onClose={() => setIsSizeFinderOpen(false)}
        availableSizes={product.sizes}
        productName={product.name}
        onSelectSize={(sz) => {
          setSelectedSize(sz);
          setRecommendedSize(sz);
        }}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={product._id}
        productName={product.name}
        onReviewSubmitted={reloadReviews}
      />
    </div>
  );
};
