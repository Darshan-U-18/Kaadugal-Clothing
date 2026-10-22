import mongoose, { Document, Schema } from 'mongoose';
import { isMongoConnected } from '../config/db';
import { loadStore, saveStore } from '../config/store';

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
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
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    shippingMethod: { type: String, default: 'standard' },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderStatus: {
      type: String,
      enum: ['ordered', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'ordered',
    },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export const OrderService = {
  async create(orderData: any) {
    const orderNumber =
      'KAD-' +
      new Date().getFullYear() +
      '-' +
      Math.floor(100000 + Math.random() * 900000);

    const fullOrder = {
      orderNumber,
      trackingNumber: 'TRK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      ...orderData,
    };

    if (isMongoConnected) {
      const order = new OrderModel(fullOrder);
      return await order.save();
    }

    const store = loadStore();
    const newOrder = {
      _id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...fullOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.orders.unshift(newOrder);
    saveStore(store);
    return newOrder;
  },

  async findByUserId(userId: string) {
    if (isMongoConnected) {
      return await OrderModel.find({ userId }).sort({ createdAt: -1 });
    }
    const store = loadStore();
    return store.orders.filter((o) => o.userId === userId);
  },

  async findByIdOrNumber(identifier: string) {
    if (isMongoConnected) {
      if (mongoose.isValidObjectId(identifier)) {
        return await OrderModel.findById(identifier);
      }
      return await OrderModel.findOne({ orderNumber: identifier });
    }
    const store = loadStore();
    return store.orders.find(
      (o) => o._id === identifier || o.orderNumber === identifier
    );
  },

  async findAll() {
    if (isMongoConnected) {
      return await OrderModel.find().sort({ createdAt: -1 });
    }
    const store = loadStore();
    return [...store.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async updateStatus(id: string, status: string, paymentStatus?: string) {
    if (isMongoConnected && mongoose.isValidObjectId(id)) {
      const updates: any = { orderStatus: status };
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      return await OrderModel.findByIdAndUpdate(id, updates, { new: true });
    }
    const store = loadStore();
    const idx = store.orders.findIndex(
      (o) => o._id === id || o.orderNumber === id
    );
    if (idx !== -1) {
      store.orders[idx].orderStatus = status;
      if (paymentStatus) store.orders[idx].paymentStatus = paymentStatus;
      store.orders[idx].updatedAt = new Date().toISOString();
      saveStore(store);
      return store.orders[idx];
    }
    return null;
  },
};
