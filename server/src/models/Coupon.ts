import mongoose, { Document, Schema } from 'mongoose';
import { isMongoConnected } from '../config/db';
import { loadStore, saveStore } from '../config/store';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minPurchase: number;
  maxDiscount?: number;
  isActive: boolean;
  expiresAt: Date;
  usedCount: number;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountAmount: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CouponModel = mongoose.model<ICoupon>('Coupon', CouponSchema);

export const CouponService = {
  async findByCode(code: string) {
    const cleanCode = code.toUpperCase().trim();
    if (isMongoConnected) {
      return await CouponModel.findOne({ code: cleanCode, isActive: true });
    }
    const store = loadStore();
    return store.coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );
  },

  async findAll() {
    if (isMongoConnected) {
      return await CouponModel.find();
    }
    const store = loadStore();
    return store.coupons;
  },

  async create(data: any) {
    const cleanCode = data.code.toUpperCase().trim();
    if (isMongoConnected) {
      const coupon = new CouponModel({ ...data, code: cleanCode });
      return await coupon.save();
    }
    const store = loadStore();
    const newCoupon = {
      _id: 'cpn_' + Date.now(),
      ...data,
      code: cleanCode,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    store.coupons.push(newCoupon);
    saveStore(store);
    return newCoupon;
  },

  async incrementUsage(code: string) {
    if (isMongoConnected) {
      return await CouponModel.findOneAndUpdate(
        { code: code.toUpperCase().trim() },
        { $inc: { usedCount: 1 } }
      );
    }
    const store = loadStore();
    const c = store.coupons.find((cp) => cp.code.toUpperCase() === code.toUpperCase().trim());
    if (c) {
      c.usedCount = (c.usedCount || 0) + 1;
      saveStore(store);
    }
  },

  async delete(id: string) {
    if (isMongoConnected && mongoose.isValidObjectId(id)) {
      return await CouponModel.findByIdAndDelete(id);
    }
    const store = loadStore();
    const idx = store.coupons.findIndex((c) => c._id === id || c.code === id);
    if (idx !== -1) {
      const [deleted] = store.coupons.splice(idx, 1);
      saveStore(store);
      return deleted;
    }
    return null;
  },
};
