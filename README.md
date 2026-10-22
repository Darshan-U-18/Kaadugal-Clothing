# 🌲 KAADUGAL — Premium 3D Forest Clothing E-Commerce Platform

> **"A clothing brand born from the forest."**  
> *Tagline: Wear Your Roots.*

---

## 🌿 Brand & Visual Direction

**KAADUGAL** combines an editorial, cinematic 3D forest environment with an independent luxury clothing storefront. Inspired by the ancient Shola rainforests of the Western Ghats, every garment is crafted with heavyweight 240 GSM organic cotton, breathable Belgian flax linen, and botanical mineral dyes.

### Color Palette
- **Forest Green**: `#163D2B`
- **Deep Forest**: `#0B2419`
- **Leaf Green**: `#386641`
- **Sage Green**: `#A8BFA5`
- **Cream White**: `#F7F8F2`
- **Pure White**: `#FFFFFF`
- **Charcoal**: `#202820`

### Typography
- **Editorial Headings**: Cormorant Garamond & Playfair Display
- **Body & Interface**: Outfit & Plus Jakarta Sans

---

## 🚀 Key Features

### 1. Immersive 3D Forest Hero Experience
- Built with **Three.js** and **React Three Fiber**.
- Procedural & instanced layered forest trees (trunks, crowns, pine layers) along a winding forest path.
- Undulating mossy terrain with realistic soil trails and foreground undergrowth (ferns, moss rocks).
- **Volumetric Sunlight God Rays** piercing through canopy gaps with additive blending.
- **Floating Pollen & Dust Motes** drifting smoothly with Brownian turbulence.
- **Interactive Mouse Parallax**: Gentle camera perspective shifts tracking cursor movements.
- **Scroll Transition**: Camera smoothly glides down the path as the user scrolls into the shopping catalog.
- Respects `prefers-reduced-motion` and provides high-res photorealistic fallback when WebGL is unsupported.

### 2. Full Product Catalog & Variants
- Real database-backed catalog with Indian Rupee (₹) pricing.
- Multi-dimensional filtering by Category, Size (XS to XXL), Color Palette, Price Range, and In-Stock status.
- Real-time search by garment name, silhouette, and fabric tags.
- Sorting by Featured, New Arrivals, Price (Low to High, High to Low), and Highest Rating.
- Product Details Page (PDP) with multi-angle high-resolution gallery, interactive zoom, dynamic size/color selectors, live inventory counters, and **Interactive Size Guide Modal** (inches & cm).
- Verified customer reviews with 5-star ratings and review submission form.

### 3. Shopping Bag & Checkout Flow
- Slide-over **Cart Drawer** with free shipping progress bar (threshold: ₹1,500).
- Instant coupon verification (`FOREST10`, `ROOTS20`, `FREESHIP`).
- Full multi-step checkout supporting contact info, shipping address, delivery speeds (Standard vs Express Eco-Courier), and payment selection.
- **Razorpay Payment Integration**:
  - Live test sandbox mode enabled when API keys are configured.
  - Transparent test-mode simulation enabled out-of-the-box when keys are not set, allowing full end-to-end checkout without payment gateway friction.
- **Order Confirmation**: Celebratory confetti animation, unique order ID (`KAD-2026-XXXXXX`), live order status progression (Ordered ➔ Processing ➔ Shipped ➔ Delivered), and printable invoice receipt.

### 4. Customer Accounts & Saved Profiles
- JWT-based authentication with secure bcrypt password hashing.
- Profile dashboard with full order history, live parcel tracking, and delivery address management (Add, Edit, Set Default, Delete).
- User wishlist persistence with 1-click "Add to Bag".

### 5. Protected Admin Operations Dashboard (`/admin`)
- Accessible by authorized store administrators.
- Live metric cards: Total Sales Revenue (₹), Total Orders, Catalog Pieces, Low Inventory alerts.
- Product Management: Add new pieces to catalog, upload imagery, update stock levels.
- Order Management: Change status (`ordered`, `processing`, `shipped`, `delivered`, `cancelled`) with instant database updates.
- Coupon Management: Generate custom promo codes, set discounts, track usage.

---

## 🛠 Technology Stack

### Frontend (`/client`)
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **React Router v7**
- **Lucide React** (icons)
- **Canvas Confetti**

### Backend (`/server`)
- **Node.js** + **Express** + **TypeScript**
- **JWT** (JSON Web Tokens) + **bcryptjs**
- **Razorpay SDK**
- **Dual-Mode Database Architecture**:
  - Seamlessly connects to **MongoDB** via Mongoose when `MONGODB_URI` is provided.
  - Automatically falls back to a persistent atomic file-backed JSON datastore (`server/data/store.json`) when local MongoDB is not running, guaranteeing 100% data persistence without external dependencies.

---

## 🔑 Demo Credentials & Test Data

### 1. Administrative Account
- **URL**: `http://localhost:5173/admin`
- **Email**: `admin@kaadugal.com`
- **Password**: `Kaadugal@2026`

### 2. Customer Account
- **Email**: `darshan@kaadugal.com`
- **Password**: `Kaadugal@2026`

### 3. Promotional Coupon Codes
- `FOREST10` — 10% Off on any order
- `ROOTS20` — 20% Off on orders above ₹1,999
- `FREESHIP` — Free shipping on eligible orders

---

## 💻 Running the Application

### Starting both Client & Server concurrently:
```bash
npm run dev
```

### Or run individually:

**Backend Server (Port 5000):**
```bash
npm --prefix server run dev
```

**Frontend Client (Port 5173):**
```bash
npm --prefix client run dev
```

**Seed Database with Forest Garments:**
```bash
npm --prefix server run seed
```

---

## 🌲 Brand Assets
- The user-uploaded brand emblem has been configured as the website's favicon (`/favicon.ico`, `/favicon.png`) and official logo mark (`/logo.png`).
