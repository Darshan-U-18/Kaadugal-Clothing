import mongoose, { Document, Schema } from 'mongoose';
import { isMongoConnected } from '../config/db';
import { loadStore, saveStore } from '../config/store';

export interface IProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: IProductColor[];
  stock: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  materials: string;
  careInstructions: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    _id: {
      type: String,
      default: () => 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercent: { type: Number, default: 0 },
    category: { type: String, required: true },
    subcategory: { type: String, default: 'Essentials' },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [
      {
        _id: false,
        name: { type: String },
        hex: { type: String },
        inStock: { type: Boolean, default: true },
      },
    ],
    stock: { type: Number, default: 50 },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    materials: { type: String, default: '100% GOTS Certified Organic Cotton (240 GSM)' },
    careInstructions: { type: String, default: 'Machine wash cold with like colors. Do not bleach. Tumble dry low or line dry in shade.' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

// Universal Product Data Access Layer
export const ProductService = {
  async find(query: any = {}) {
    if (isMongoConnected) {
      return await ProductModel.find(query).sort({ createdAt: -1 });
    }
    const store = loadStore();
    let results = [...store.products];

    if (query.category) {
      results = results.filter(
        (p) => p.category.toLowerCase() === query.category.toLowerCase()
      );
    }
    if (query.isFeatured !== undefined) {
      results = results.filter((p) => p.isFeatured === query.isFeatured);
    }
    if (query.isBestseller !== undefined) {
      results = results.filter((p) => p.isBestseller === query.isBestseller);
    }
    if (query.isNewArrival !== undefined) {
      results = results.filter((p) => p.isNewArrival === query.isNewArrival);
    }
    return results;
  },

  async findById(id: string) {
    if (isMongoConnected) {
      return await ProductModel.findOne({ $or: [{ _id: id }, { slug: id }] });
    }
    const store = loadStore();
    return store.products.find((p) => p._id === id || p.slug === id);
  },

  async findBySlug(slug: string) {
    if (isMongoConnected) {
      return await ProductModel.findOne({ $or: [{ slug }, { _id: slug }] });
    }
    const store = loadStore();
    return store.products.find((p) => p.slug === slug || p._id === slug);
  },

  async create(data: any) {
    if (isMongoConnected) {
      const prod = new ProductModel({
        _id: data._id || 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...data,
      });
      return await prod.save();
    }
    const store = loadStore();
    const newProd = {
      _id: data._id || 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.products.push(newProd);
    saveStore(store);
    return newProd;
  },

  async findByIdAndUpdate(id: string, data: any) {
    if (isMongoConnected) {
      return await ProductModel.findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }] },
        data,
        { new: true }
      );
    }
    const store = loadStore();
    const idx = store.products.findIndex((p) => p._id === id || p.slug === id);
    if (idx !== -1) {
      store.products[idx] = {
        ...store.products[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveStore(store);
      return store.products[idx];
    }
    return null;
  },

  async findByIdAndDelete(id: string) {
    if (isMongoConnected) {
      return await ProductModel.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    }
    const store = loadStore();
    const idx = store.products.findIndex((p) => p._id === id);
    if (idx !== -1) {
      const [deleted] = store.products.splice(idx, 1);
      saveStore(store);
      return deleted;
    }
    return null;
  },
};
