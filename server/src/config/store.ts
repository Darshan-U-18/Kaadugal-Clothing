import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

export interface DataStore {
  users: any[];
  products: any[];
  orders: any[];
  coupons: any[];
  reviews: any[];
  categories: any[];
}

const defaultData: DataStore = {
  users: [],
  products: [],
  orders: [],
  coupons: [],
  reviews: [],
  categories: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadStore(): DataStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (!Array.isArray(data.users)) data.users = [];
      if (!Array.isArray(data.products)) data.products = [];
      if (!Array.isArray(data.orders)) data.orders = [];
      if (!Array.isArray(data.coupons)) data.coupons = [];
      if (!Array.isArray(data.reviews)) data.reviews = [];
      if (!Array.isArray(data.categories)) data.categories = [];

      let modified = false;

      // Update admin user to admin@admin.com if needed and sync roles
      data.users.forEach((u: any) => {
        if (u._id === 'usr_admin_01' && u.email === 'admin@kaadugal.com') {
          u.email = 'admin@admin.com';
          u.role = 'admin';
          modified = true;
        }
        if (typeof u.email === 'string') {
          const isAtAdmin = u.email.toLowerCase().endsWith('@admin.com');
          if (isAtAdmin && u.role !== 'admin') {
            u.role = 'admin';
            modified = true;
          } else if (!isAtAdmin && u.role === 'admin') {
            u.role = 'customer';
            modified = true;
          }
        }
      });

      // Seed initial sample orders if empty so dashboard displays rich sales analytics
      if (data.orders.length === 0) {
        data.orders = [
          {
            _id: 'ord_demo_01',
            orderNumber: 'KAD-2026-891042',
            userId: 'usr_cust_01',
            customerEmail: 'darshanpec2006@gmail.com',
            customerName: 'Alice',
            items: [
              {
                productId: 'prod_mens_001',
                name: 'Forest Oversized Heavyweight T-Shirt',
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
                price: 1299,
                quantity: 2,
                size: 'L',
                color: 'Forest Green',
              },
              {
                productId: 'prod_mens_003',
                name: 'Sage Camp Collar Linen Shirt',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
                price: 1899,
                quantity: 1,
                size: 'M',
                color: 'Sage Green',
              },
            ],
            shippingAddress: {
              fullName: 'Alice',
              phone: '+91 98450 12345',
              street: '14B Green Gardenia Enclave, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              postalCode: '560038',
              country: 'India',
            },
            shippingMethod: 'standard',
            subtotal: 4497,
            discount: 450,
            tax: 202,
            shippingFee: 0,
            total: 4249,
            couponCode: 'FOREST10',
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
            razorpayOrderId: 'order_live_98129',
            razorpayPaymentId: 'pay_98129182',
            orderStatus: 'delivered',
            trackingNumber: 'TRK-BLR98214',
            createdAt: '2026-10-21T11:20:00.000Z',
            updatedAt: '2026-10-23T14:30:00.000Z',
          },
          {
            _id: 'ord_demo_02',
            orderNumber: 'KAD-2026-764319',
            userId: 'usr_cust_01',
            customerEmail: 'darshanpec2006@outlook.com',
            customerName: 'Alice',
            items: [
              {
                productId: 'prod_mens_006',
                name: 'Forest Heavyweight 400 GSM Hoodie',
                image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
                price: 2799,
                quantity: 1,
                size: 'XL',
                color: 'Deep Forest',
              },
            ],
            shippingAddress: {
              fullName: 'Alice',
              phone: '+91 98450 12345',
              street: '14B Green Gardenia Enclave, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              postalCode: '560038',
              country: 'India',
            },
            shippingMethod: 'express',
            subtotal: 2799,
            discount: 280,
            tax: 126,
            shippingFee: 150,
            total: 2795,
            couponCode: 'FOREST10',
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
            orderStatus: 'shipped',
            trackingNumber: 'TRK-EXP44190',
            createdAt: '2026-10-22T09:15:00.000Z',
            updatedAt: '2026-10-23T08:00:00.000Z',
          },
          {
            _id: 'ord_demo_03',
            orderNumber: 'KAD-2026-512804',
            customerEmail: 'priya.nair@gmail.com',
            customerName: 'Priya Nair',
            items: [
              {
                productId: 'prod_womens_001',
                name: 'Canopy Organic Linen Smock Midi Dress',
                image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80',
                price: 2999,
                quantity: 1,
                size: 'M',
                color: 'Sage Green',
              },
              {
                productId: 'prod_womens_007',
                name: 'Bamboo-Cotton Boxy Boatneck Crop Top',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
                price: 1199,
                quantity: 1,
                size: 'S',
                color: 'Forest Green',
              },
            ],
            shippingAddress: {
              fullName: 'Priya Nair',
              phone: '+91 97110 54321',
              street: '88 Palm Meadows Villa',
              city: 'Kochi',
              state: 'Kerala',
              postalCode: '682001',
              country: 'India',
            },
            shippingMethod: 'standard',
            subtotal: 4198,
            discount: 420,
            tax: 189,
            shippingFee: 0,
            total: 3967,
            couponCode: 'FOREST10',
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
            orderStatus: 'processing',
            trackingNumber: 'TRK-KOC19482',
            createdAt: '2026-10-23T14:40:00.000Z',
            updatedAt: '2026-10-23T15:10:00.000Z',
          },
          {
            _id: 'ord_demo_04',
            orderNumber: 'KAD-2026-309172',
            customerEmail: 'rohit.sen@gmail.com',
            customerName: 'Rohit Sen',
            items: [
              {
                productId: 'prod_genz_001',
                name: 'Cyber-Forest Wide-Leg Parachute Pants',
                image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
                price: 2499,
                quantity: 1,
                size: 'L',
                color: 'Charcoal Black',
              },
            ],
            shippingAddress: {
              fullName: 'Rohit Sen',
              phone: '+91 98200 98765',
              street: '402 Bandra West Bay View',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400050',
              country: 'India',
            },
            shippingMethod: 'standard',
            subtotal: 2499,
            discount: 0,
            tax: 125,
            shippingFee: 99,
            total: 2723,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            orderStatus: 'ordered',
            trackingNumber: 'TRK-MUM77192',
            createdAt: '2026-10-23T18:05:00.000Z',
            updatedAt: '2026-10-23T18:05:00.000Z',
          },
        ];
        modified = true;
      }

      // Seed initial coupons if empty
      if (data.coupons.length === 0) {
        data.coupons = [
          {
            _id: 'cpn_01',
            code: 'FOREST10',
            discountType: 'percentage',
            discountAmount: 10,
            minPurchase: 0,
            maxDiscount: 500,
            isActive: true,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            usedCount: 142,
          },
          {
            _id: 'cpn_02',
            code: 'ROOTS20',
            discountType: 'percentage',
            discountAmount: 20,
            minPurchase: 1999,
            maxDiscount: 1000,
            isActive: true,
            expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            usedCount: 88,
          },
          {
            _id: 'cpn_03',
            code: 'FREESHIP',
            discountType: 'fixed',
            discountAmount: 99,
            minPurchase: 999,
            isActive: true,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            usedCount: 231,
          },
        ];
        modified = true;
      }

      if (modified) {
        saveStore(data);
      }

      return data;
    }
  } catch (err) {
    console.error('Error reading store file, initializing default:', err);
  }
  saveStore(defaultData);
  return defaultData;
}

export function saveStore(data: DataStore): void {
  try {
    const tempFile = STORE_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, STORE_FILE);
  } catch (err) {
    console.error('Error saving store:', err);
  }
}
