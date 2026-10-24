import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';
import { CouponModel } from '../models/Coupon';
import { ReviewModel } from '../models/Review';

dotenv.config();

export interface ImportStats {
  sourceCounts: Record<string, number>;
  beforeCounts: Record<string, number>;
  insertedCounts: Record<string, number>;
  skippedCounts: Record<string, number>;
  conflictCounts: Record<string, number>;
  afterCounts: Record<string, number>;
  conflicts: string[];
}

export async function runIdempotentImport(): Promise<ImportStats> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri);
  const dbName = mongoose.connection.name;
  if (dbName !== 'Kaadugal') {
    await mongoose.disconnect();
    throw new Error(`Safety check failed: Connected to "${dbName}", expected "Kaadugal"`);
  }

  const db = mongoose.connection.db;
  if (!db) {
    await mongoose.disconnect();
    throw new Error('Database connection not established');
  }
  const storePath = path.join(__dirname, '../../data/store.json');
  if (!fs.existsSync(storePath)) {
    throw new Error(`Source store file not found at ${storePath}`);
  }

  const raw = fs.readFileSync(storePath, 'utf8');
  const store = JSON.parse(raw);

  const stats: ImportStats = {
    sourceCounts: {
      users: store.users?.length || 0,
      products: store.products?.length || 0,
      orders: store.orders?.length || 0,
      coupons: store.coupons?.length || 0,
      reviews: store.reviews?.length || 0,
    },
    beforeCounts: {
      users: await db.collection('users').countDocuments(),
      products: await db.collection('products').countDocuments(),
      orders: await db.collection('orders').countDocuments(),
      coupons: await db.collection('coupons').countDocuments(),
      reviews: await db.collection('reviews').countDocuments(),
    },
    insertedCounts: { users: 0, products: 0, orders: 0, coupons: 0, reviews: 0 },
    skippedCounts: { users: 0, products: 0, orders: 0, coupons: 0, reviews: 0 },
    conflictCounts: { users: 0, products: 0, orders: 0, coupons: 0, reviews: 0 },
    afterCounts: { users: 0, products: 0, orders: 0, coupons: 0, reviews: 0 },
    conflicts: [],
  };

  // 1. IMPORT USERS
  for (const user of store.users || []) {
    const cleanEmail = user.email.toLowerCase().trim();
    // Validate schema
    const validationDoc = new UserModel(user);
    const valErr = validationDoc.validateSync();
    if (valErr) {
      stats.conflictCounts.users++;
      stats.conflicts.push(`User ${user.email}: Schema validation failed - ${valErr.message}`);
      continue;
    }

    const existing = await db.collection('users').findOne({
      $or: [{ email: cleanEmail }, { _id: user._id }],
    });

    if (existing) {
      stats.skippedCounts.users++;
    } else {
      const res = await db.collection('users').updateOne(
        { email: cleanEmail },
        {
          $setOnInsert: {
            ...user,
            email: cleanEmail,
            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
            updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
          },
        },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        stats.insertedCounts.users++;
      } else {
        stats.skippedCounts.users++;
      }
    }
  }

  // 2. IMPORT PRODUCTS
  for (const prod of store.products || []) {
    const validationDoc = new ProductModel(prod);
    const valErr = validationDoc.validateSync();
    if (valErr) {
      stats.conflictCounts.products++;
      stats.conflicts.push(`Product ${prod._id} (${prod.name}): Schema validation failed - ${valErr.message}`);
      continue;
    }

    const existing = await db.collection('products').findOne({
      $or: [{ _id: prod._id }, { slug: prod.slug }],
    });

    if (existing) {
      if (existing._id !== prod._id || existing.slug !== prod.slug) {
        stats.conflictCounts.products++;
        stats.conflicts.push(`Product ID/Slug conflict: source (${prod._id}, ${prod.slug}) vs mongo (${existing._id}, ${existing.slug})`);
      } else {
        stats.skippedCounts.products++;
      }
    } else {
      const res = await db.collection('products').updateOne(
        { _id: prod._id },
        {
          $setOnInsert: {
            ...prod,
            createdAt: prod.createdAt ? new Date(prod.createdAt) : new Date(),
            updatedAt: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
          },
        },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        stats.insertedCounts.products++;
      } else {
        stats.skippedCounts.products++;
      }
    }
  }

  // 3. IMPORT ORDERS
  for (const ord of store.orders || []) {
    const validationDoc = new OrderModel(ord);
    const valErr = validationDoc.validateSync();
    if (valErr) {
      stats.conflictCounts.orders++;
      stats.conflicts.push(`Order ${ord._id}: Schema validation failed - ${valErr.message}`);
      continue;
    }

    const existing = await db.collection('orders').findOne({
      $or: [{ _id: ord._id }, { orderNumber: ord.orderNumber }],
    });

    if (existing) {
      stats.skippedCounts.orders++;
    } else {
      const res = await db.collection('orders').updateOne(
        { _id: ord._id },
        {
          $setOnInsert: {
            ...ord,
            createdAt: ord.createdAt ? new Date(ord.createdAt) : new Date(),
            updatedAt: ord.updatedAt ? new Date(ord.updatedAt) : new Date(),
          },
        },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        stats.insertedCounts.orders++;
      } else {
        stats.skippedCounts.orders++;
      }
    }
  }

  // 4. IMPORT COUPONS
  for (const cpn of store.coupons || []) {
    const cleanCode = cpn.code.toUpperCase().trim();
    const validationDoc = new CouponModel({ ...cpn, code: cleanCode });
    const valErr = validationDoc.validateSync();
    if (valErr) {
      stats.conflictCounts.coupons++;
      stats.conflicts.push(`Coupon ${cpn.code}: Schema validation failed - ${valErr.message}`);
      continue;
    }

    const existing = await db.collection('coupons').findOne({
      $or: [{ code: cleanCode }, { _id: cpn._id }],
    });

    if (existing) {
      stats.skippedCounts.coupons++;
    } else {
      const res = await db.collection('coupons').updateOne(
        { code: cleanCode },
        {
          $setOnInsert: {
            ...cpn,
            code: cleanCode,
            expiresAt: new Date(cpn.expiresAt),
            createdAt: cpn.createdAt ? new Date(cpn.createdAt) : new Date(),
          },
        },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        stats.insertedCounts.coupons++;
      } else {
        stats.skippedCounts.coupons++;
      }
    }
  }

  // 5. IMPORT REVIEWS
  for (const rev of store.reviews || []) {
    const validationDoc = new ReviewModel(rev);
    const valErr = validationDoc.validateSync();
    if (valErr) {
      stats.conflictCounts.reviews++;
      stats.conflicts.push(`Review ${rev._id}: Schema validation failed - ${valErr.message}`);
      continue;
    }

    const existing = await db.collection('reviews').findOne({ _id: rev._id });
    if (existing) {
      stats.skippedCounts.reviews++;
    } else {
      const res = await db.collection('reviews').updateOne(
        { _id: rev._id },
        {
          $setOnInsert: {
            ...rev,
            createdAt: rev.createdAt ? new Date(rev.createdAt) : new Date(),
          },
        },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        stats.insertedCounts.reviews++;
      } else {
        stats.skippedCounts.reviews++;
      }
    }
  }

  // Final document counts
  stats.afterCounts = {
    users: await db.collection('users').countDocuments(),
    products: await db.collection('products').countDocuments(),
    orders: await db.collection('orders').countDocuments(),
    coupons: await db.collection('coupons').countDocuments(),
    reviews: await db.collection('reviews').countDocuments(),
  };

  await mongoose.disconnect();
  return stats;
}

if (require.main === module) {
  runIdempotentImport()
    .then((stats) => {
      console.log('IMPORT_COMPLETE_STATS:' + JSON.stringify(stats));
      process.exit(0);
    })
    .catch((err) => {
      console.error('IMPORT_FATAL_ERROR:', err);
      process.exit(1);
    });
}
