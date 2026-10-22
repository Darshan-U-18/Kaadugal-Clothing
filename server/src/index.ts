import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { seedDatabase } from './scripts/seed';
import { loadStore } from './config/store';

import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import couponRoutes from './routes/couponRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    brand: 'KAADUGAL',
    tagline: 'Wear Your Roots',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and Initialize DB
const startServer = async () => {
  await connectDB();

  // If store has 0 products, automatically run seed
  const store = loadStore();
  if (!store.products || store.products.length === 0) {
    console.log('[Bootstrap] Initializing first-time product catalog & demo records...');
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🌲 KAADUGAL Server running on http://localhost:${PORT}`);
    console.log(`🌿 API documentation and endpoints active on http://localhost:${PORT}/api/products`);
  });
};

startServer();
