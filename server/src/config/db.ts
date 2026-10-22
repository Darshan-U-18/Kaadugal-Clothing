import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loadStore } from './store';

dotenv.config();

export let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
      });
      isMongoConnected = true;
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error: any) {
      console.warn(`[Database] MongoDB connection failed: ${error.message}. Falling back to Persistent Embedded Store.`);
    }
  }

  // Load persistent embedded store
  const store = loadStore();
  console.log(`[Database] Active: Persistent Embedded JSON DataStore (${store.products.length} products loaded)`);
};
