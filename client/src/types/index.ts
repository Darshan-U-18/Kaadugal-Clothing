export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  materials: string;
  careInstructions: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  color: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  shippingAddress: Address;
  shippingMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface Coupon {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  discountCalculated?: number;
  minPurchase?: number;
  maxDiscount?: number;
  isActive?: boolean;
  usedCount?: number;
}

export interface Review {
  _id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface FilterOptions {
  category: string;
  size: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  search: string;
  sort: string;
  inStock: boolean;
}
