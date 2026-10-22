import mongoose, { Document, Schema } from 'mongoose';
import { isMongoConnected } from '../config/db';
import { loadStore, saveStore } from '../config/store';

export interface IReview extends Document {
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);

export const ReviewService = {
  async findByProduct(productId: string) {
    if (isMongoConnected) {
      return await ReviewModel.find({ productId }).sort({ createdAt: -1 });
    }
    const store = loadStore();
    return store.reviews
      .filter((r) => r.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: any) {
    if (isMongoConnected) {
      const review = new ReviewModel(data);
      return await review.save();
    }
    const store = loadStore();
    const newReview = {
      _id: 'rev_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    store.reviews.push(newReview);
    saveStore(store);
    return newReview;
  },

  async getAll() {
    if (isMongoConnected) {
      return await ReviewModel.find().sort({ createdAt: -1 });
    }
    const store = loadStore();
    return store.reviews;
  }
};
