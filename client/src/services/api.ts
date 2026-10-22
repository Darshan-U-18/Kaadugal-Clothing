import { Product, Order, Coupon, Review, User } from '../types';

const BASE_URL = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('kaadugal_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('kaadugal_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('kaadugal_token');
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  let data: any = {};
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Products
  async getProducts(params: Record<string, any> = {}): Promise<{ products: Product[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return request(`products?${query.toString()}`);
  },

  async getProduct(idOrSlug: string): Promise<{ product: Product }> {
    return request(`products/${idOrSlug}`);
  },

  async getRelatedProducts(id: string): Promise<{ products: Product[] }> {
    return request(`products/${id}/related`);
  },

  async getCategories(): Promise<{ categories: { name: string; count: number }[] }> {
    return request('products/categories');
  },

  async createProduct(data: any): Promise<{ product: Product }> {
    return request('products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: any): Promise<{ product: Product }> {
    return request(`products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return request(`products/${id}`, {
      method: 'DELETE',
    });
  },

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: User }> {
    return request('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: { name: string; email: string; password: string }): Promise<{ token: string; user: User }> {
    return request('auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfile(): Promise<{ user: User }> {
    return request('auth/profile');
  },

  async updateProfile(data: { name: string }): Promise<{ user: User }> {
    return request('auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async addAddress(data: any): Promise<{ user: User }> {
    return request('auth/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAddress(addressId: string): Promise<{ user: User }> {
    return request(`auth/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  async toggleWishlist(productId: string): Promise<{ wishlist: string[] }> {
    return request('auth/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  async getWishlist(): Promise<{ products: Product[] }> {
    return request('auth/wishlist');
  },

  // Orders & Payment
  async createOrder(orderData: any): Promise<{ order: Order }> {
    return request('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async createRazorpayOrder(amount: number, receipt?: string): Promise<any> {
    return request('orders/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, receipt }),
    });
  },

  async verifyRazorpayPayment(paymentData: any): Promise<{ order: Order }> {
    return request('orders/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async getMyOrders(): Promise<{ orders: Order[] }> {
    return request('orders/my-orders');
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    return request(`orders/${id}`);
  },

  async getAllOrders(): Promise<{ orders: Order[] }> {
    return request('orders/admin/all');
  },

  async updateOrderStatus(id: string, statusData: { orderStatus: string; paymentStatus?: string }): Promise<{ order: Order }> {
    return request(`orders/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Coupons
  async validateCoupon(code: string, cartTotal: number): Promise<{ coupon: Coupon }> {
    return request('coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    });
  },

  async getAllCoupons(): Promise<{ coupons: any[] }> {
    return request('coupons');
  },

  async createCoupon(data: any): Promise<{ coupon: any }> {
    return request('coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteCoupon(id: string): Promise<{ message: string }> {
    return request(`coupons/${id}`, {
      method: 'DELETE',
    });
  },

  // Reviews
  async getReviews(productId: string): Promise<{ reviews: Review[] }> {
    return request(`reviews/product/${productId}`);
  },

  async createReview(data: any): Promise<{ review: Review }> {
    return request('reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin
  async getAdminStats(): Promise<{ stats: any }> {
    return request('admin/stats');
  },
};
