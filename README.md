# SOLEVERSE — Luxury Sneaker E-Commerce Platform

SOLEVERSE is a full-stack luxury & performance sneaker e-commerce storefront built with React, TypeScript, Vite, Tailwind CSS, and Supabase (PostgreSQL, Auth, Row Level Security, RPC transactions, and Storage).

## 1. Supabase Setup

1. Create a new project in [Supabase](https://supabase.com).
2. Open **SQL Editor** in your Supabase project and execute `supabase/schema.sql`.
   - Creates 13 relational tables (`profiles`, `categories`, `products`, `product_images`, `product_variants`, `cart_items`, `wishlist_items`, `orders`, `order_items`, `reviews`, `addresses`, `coupons`, `site_settings`).
   - Enables Row Level Security (RLS) on all tables.
   - Provisions the `product-images` public storage bucket with admin-only upload/delete policies.
   - Creates transactional RPCs `validate_coupon` and `place_cod_order` (atomic stock validation, authoritative PKR total calculation, stock decrement, and order creation).
3. Execute `supabase/seed.sql` in **SQL Editor** to seed 8 categories, 52 unique sneaker products, 104 primary/detail studio images, size & colorway variants, promo codes (`SOLE10`, `ATELIER2500`), and store settings.
4. Register your user via `/register` on the site, then promote your admin account in **SQL Editor**:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@example.com';
   ```

## 2. Environment Variables

Copy `.env.example` to `.env` locally (never commit `.env` or `service_role` keys):

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-supabase-anon-key"
```

## 3. Local Development & Build

```bash
npm install
npm run dev
npm run lint
npm run build
```

## 4. GitHub & Vercel Deployment

1. Push the repository to GitHub (`.gitignore` excludes `.env`).
2. Import the repository in [Vercel](https://vercel.com) (Framework preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`). `vercel.json` handles SPA routing for all React Router paths.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Project Settings → Environment Variables**.
4. Trigger a fresh **Redeploy** in Vercel after adding or modifying `VITE_*` variables so Vite bakes them into the production bundle.
