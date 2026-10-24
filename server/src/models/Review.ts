import mongoose, { Document, Schema } from 'mongoose';
import { isMongoConnected } from '../config/db';
import { loadStore, saveStore } from '../config/store';
import { ProductModel } from './Product';

export interface IReview {
  _id: string;
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
    _id: {
      type: String,
      default: () => 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    },
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
      const targetProd = await ProductModel.findOne({ $or: [{ _id: productId }, { slug: productId }] });
      const validIds = [productId];
      if (targetProd) {
        if (targetProd._id && !validIds.includes(targetProd._id)) validIds.push(targetProd._id);
        if (targetProd.slug && !validIds.includes(targetProd.slug)) validIds.push(targetProd.slug);
        if (targetProd._id === 'prod_mens_001') validIds.push('prod_01');
        if (targetProd._id === 'prod_mens_002') validIds.push('prod_02');
        if (targetProd._id === 'prod_mens_003') validIds.push('prod_03');
        if (targetProd._id === 'prod_mens_006') validIds.push('prod_06');
      }
      return await ReviewModel.find({ productId: { $in: validIds } }).sort({ createdAt: -1 });
    }
    const store = loadStore();
    const targetProd = store.products.find((p) => p._id === productId || p.slug === productId);
    const validIds = new Set<string>([productId]);
    if (targetProd) {
      if (targetProd._id) validIds.add(targetProd._id);
      if (targetProd.slug) validIds.add(targetProd.slug);
      if (targetProd._id === 'prod_mens_001') validIds.add('prod_01');
      if (targetProd._id === 'prod_mens_002') validIds.add('prod_02');
      if (targetProd._id === 'prod_mens_003') validIds.add('prod_03');
      if (targetProd._id === 'prod_mens_006') validIds.add('prod_06');
    }
    return store.reviews
      .filter((r) => validIds.has(r.productId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: any) {
    const store = loadStore();
    let canonicalId = data.productId;
    if (isMongoConnected) {
      const targetProd = await ProductModel.findOne({ $or: [{ _id: data.productId }, { slug: data.productId }] });
      if (targetProd && targetProd._id) canonicalId = targetProd._id;

      const review = new ReviewModel({
        _id: data._id || 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...data,
        productId: canonicalId,
      });
      return await review.save();
    }

    const targetProd = store.products.find(
      (p) => p._id === data.productId || p.slug === data.productId
    );
    if (targetProd && targetProd._id) canonicalId = targetProd._id;

    const newReview = {
      _id: data._id || 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      productId: canonicalId,
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
