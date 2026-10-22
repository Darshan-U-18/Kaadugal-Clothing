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
      return JSON.parse(content);
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
