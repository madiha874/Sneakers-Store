-- =============================================================================
-- SOLEVERSE SNEAKER E-COMMERCE — PRODUCTION POSTGRESQL & SUPABASE SCHEMA
-- Safe, idempotent, non-destructive migration (no DROP TABLE statements).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users with role-based access control)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- -----------------------------------------------------------------------------
-- 2. CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_group TEXT NOT NULL DEFAULT 'lifestyle'
    CHECK (parent_group IN ('men', 'women', 'running', 'sports', 'lifestyle')),
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_group);

-- -----------------------------------------------------------------------------
-- 2B. BRANDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

-- -----------------------------------------------------------------------------
-- 3. PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL DEFAULT 'SOLEVERSE',
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  material_notes TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  gender TEXT NOT NULL DEFAULT 'unisex' CHECK (gender IN ('men', 'women', 'unisex')),
  collection_type TEXT NOT NULL DEFAULT 'casual'
    CHECK (collection_type IN (
      'casual', 'running', 'sports', 'training', 'lifestyle', 'walking', 'high-top', 'low-top'
    )),
  price_pkr NUMERIC(12, 2) NOT NULL CHECK (price_pkr >= 0),
  discount_price_pkr NUMERIC(12, 2) CHECK (discount_price_pkr IS NULL OR discount_price_pkr >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
  review_count INTEGER NOT NULL DEFAULT 0,
  sales_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safe migration if products existed prior to brands table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);

-- -----------------------------------------------------------------------------
-- 4. PRODUCT IMAGES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- -----------------------------------------------------------------------------
-- 5. PRODUCT VARIANTS (Size & Colorway Stock)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_eu TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#111111',
  sku_variant TEXT NOT NULL UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price_override_pkr NUMERIC(12, 2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, size_eu, color_name)
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_size ON public.product_variants(size_eu);

-- -----------------------------------------------------------------------------
-- 6. CART ITEMS (Persisted for authenticated customers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

-- -----------------------------------------------------------------------------
-- 7. WISHLIST ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist_items(user_id);

-- -----------------------------------------------------------------------------
-- 8. ADDRESSES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL DEFAULT '',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- -----------------------------------------------------------------------------
-- 9. COUPONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- -----------------------------------------------------------------------------
-- 10. ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  order_notes TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery (COD)',
  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  subtotal_pkr NUMERIC(12, 2) NOT NULL CHECK (subtotal_pkr >= 0),
  discount_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_pkr >= 0),
  delivery_fee_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee_pkr >= 0),
  total_pkr NUMERIC(12, 2) NOT NULL CHECK (total_pkr >= 0),
  coupon_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- -----------------------------------------------------------------------------
-- 11. ORDER ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL DEFAULT '',
  size_eu TEXT NOT NULL,
  color_name TEXT NOT NULL,
  unit_price_pkr NUMERIC(12, 2) NOT NULL CHECK (unit_price_pkr >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total_pkr NUMERIC(12, 2) NOT NULL CHECK (line_total_pkr >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- -----------------------------------------------------------------------------
-- 12. REVIEWS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL DEFAULT '',
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- -----------------------------------------------------------------------------
-- 13. SITE SETTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- Check admin role safely without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Automatically update updated_at column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_variants_updated_at ON public.product_variants;
CREATE TRIGGER trg_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Prevent non-admin users from escalating their own role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: role cannot be modified by customer accounts.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Create profile row automatically when a new user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recalculate product rating summary when reviews change
CREATE OR REPLACE FUNCTION public.update_product_rating_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id UUID;
BEGIN
  v_product_id := COALESCE(NEW.product_id, OLD.product_id);
  UPDATE public.products
  SET
    rating_avg = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.reviews
      WHERE product_id = v_product_id AND is_approved = TRUE
    ), 4.80),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE product_id = v_product_id AND is_approved = TRUE
    )
  WHERE id = v_product_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_reviews_stats ON public.reviews;
CREATE TRIGGER trg_reviews_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating_stats();

-- =============================================================================
-- TRANSACTIONAL RPCs (SECURE SERVER-SIDE CHECKOUT & COUPON VALIDATION)
-- =============================================================================

-- Validate a coupon code securely
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code TEXT,
  p_subtotal_pkr NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon public.coupons%ROWTYPE;
  v_discount NUMERIC(12, 2);
BEGIN
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE UPPER(code) = UPPER(TRIM(p_code))
    AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', FALSE, 'message', 'Promo code not found or inactive.');
  END IF;

  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', FALSE, 'message', 'This promo code has expired.');
  END IF;

  IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN
    RETURN jsonb_build_object('valid', FALSE, 'message', 'This promo code has reached its redemption limit.');
  END IF;

  IF p_subtotal_pkr < v_coupon.min_order_pkr THEN
    RETURN jsonb_build_object(
      'valid', FALSE,
      'message', 'Minimum order of PKR ' || TO_CHAR(v_coupon.min_order_pkr, 'FM999,999,999') || ' required for this code.'
    );
  END IF;

  IF v_coupon.discount_type = 'percentage' THEN
    v_discount := ROUND((p_subtotal_pkr * (v_coupon.discount_value / 100.0))::numeric, 0);
  ELSE
    v_discount := LEAST(v_coupon.discount_value, p_subtotal_pkr);
  END IF;

  RETURN jsonb_build_object(
    'valid', TRUE,
    'code', v_coupon.code,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'discount_pkr', v_discount,
    'description', v_coupon.description
  );
END;
$$;

-- Transactional Cash on Delivery (COD) Order Placement RPC
-- Validates variants, locks stock rows, calculates authoritative prices,
-- applies valid coupons & delivery fees, creates order & order_items,
-- decrements stock, and clears user cart atomically.
CREATE OR REPLACE FUNCTION public.place_cod_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_shipping_address TEXT,
  p_city TEXT,
  p_postal_code TEXT,
  p_order_notes TEXT DEFAULT '',
  p_coupon_code TEXT DEFAULT NULL,
  p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_item JSONB;
  v_variant_id UUID;
  v_qty INTEGER;
  v_variant RECORD;
  v_product RECORD;
  v_primary_img TEXT;
  v_unit_price NUMERIC(12, 2);
  v_line_total NUMERIC(12, 2);
  v_subtotal NUMERIC(12, 2) := 0;
  v_discount NUMERIC(12, 2) := 0;
  v_delivery_fee NUMERIC(12, 2) := 350;
  v_free_threshold NUMERIC(12, 2) := 25000;
  v_total NUMERIC(12, 2);
  v_coupon public.coupons%ROWTYPE;
  v_applied_coupon TEXT := NULL;
  v_order_id UUID;
  v_order_number TEXT;
  v_shipping_cfg JSONB;
  v_items_snapshot JSONB := '[]'::jsonb;
BEGIN
  v_user_id := auth.uid();

  -- Validate customer contact inputs
  IF LENGTH(TRIM(COALESCE(p_customer_name, ''))) < 2 THEN
    RAISE EXCEPTION 'Full name is required.';
  END IF;
  IF POSITION('@' IN COALESCE(p_customer_email, '')) < 2 THEN
    RAISE EXCEPTION 'Valid email address is required.';
  END IF;
  IF LENGTH(TRIM(COALESCE(p_customer_phone, ''))) < 7 THEN
    RAISE EXCEPTION 'Valid phone number is required.';
  END IF;
  IF LENGTH(TRIM(COALESCE(p_shipping_address, ''))) < 5 THEN
    RAISE EXCEPTION 'Complete delivery address is required.';
  END IF;
  IF LENGTH(TRIM(COALESCE(p_city, ''))) < 2 THEN
    RAISE EXCEPTION 'City is required.';
  END IF;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Your shopping bag is empty.';
  END IF;

  -- Load site shipping configuration if present
  SELECT value INTO v_shipping_cfg
  FROM public.site_settings
  WHERE key = 'shipping';

  IF v_shipping_cfg IS NOT NULL THEN
    v_delivery_fee := COALESCE((v_shipping_cfg ->> 'flat_rate_pkr')::numeric, 350);
    v_free_threshold := COALESCE((v_shipping_cfg ->> 'free_threshold_pkr')::numeric, 25000);
  END IF;

  -- First pass: lock variants, verify stock, and calculate authoritative subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_variant_id := (v_item ->> 'variant_id')::uuid;
    v_qty := (v_item ->> 'quantity')::integer;

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity specified.';
    END IF;

    SELECT * INTO v_variant
    FROM public.product_variants
    WHERE id = v_variant_id AND is_active = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Selected sneaker size/color variant is unavailable.';
    END IF;

    IF v_variant.stock_quantity < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for size EU % (%). Only % remaining.',
        v_variant.size_eu, v_variant.color_name, v_variant.stock_quantity;
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = v_variant.product_id AND is_active = TRUE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product is no longer active.';
    END IF;

    SELECT image_url INTO v_primary_img
    FROM public.product_images
    WHERE product_id = v_product.id
    ORDER BY is_primary DESC, display_order ASC
    LIMIT 1;

    v_unit_price := COALESCE(v_variant.price_override_pkr, v_product.discount_price_pkr, v_product.price_pkr);
    v_line_total := v_unit_price * v_qty;
    v_subtotal := v_subtotal + v_line_total;

    v_items_snapshot := v_items_snapshot || jsonb_build_object(
      'product_id', v_product.id,
      'variant_id', v_variant.id,
      'product_name', v_product.name,
      'product_image', COALESCE(v_primary_img, ''),
      'size_eu', v_variant.size_eu,
      'color_name', v_variant.color_name,
      'unit_price_pkr', v_unit_price,
      'quantity', v_qty,
      'line_total_pkr', v_line_total
    );
  END LOOP;

  -- Apply coupon if provided
  IF p_coupon_code IS NOT NULL AND LENGTH(TRIM(p_coupon_code)) > 0 THEN
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE UPPER(code) = UPPER(TRIM(p_coupon_code))
      AND is_active = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Promo code "%" is invalid or inactive.', p_coupon_code;
    END IF;
    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
      RAISE EXCEPTION 'Promo code "%" has expired.', p_coupon_code;
    END IF;
    IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN
      RAISE EXCEPTION 'Promo code "%" has reached its usage limit.', p_coupon_code;
    END IF;
    IF v_subtotal < v_coupon.min_order_pkr THEN
      RAISE EXCEPTION 'Minimum order of PKR % required for code "%".', v_coupon.min_order_pkr, v_coupon.code;
    END IF;

    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := ROUND((v_subtotal * (v_coupon.discount_value / 100.0))::numeric, 0);
    ELSE
      v_discount := LEAST(v_coupon.discount_value, v_subtotal);
    END IF;

    v_applied_coupon := v_coupon.code;
    UPDATE public.coupons SET used_count = used_count + 1 WHERE id = v_coupon.id;
  END IF;

  -- Compute delivery fee
  IF (v_subtotal - v_discount) >= v_free_threshold THEN
    v_delivery_fee := 0;
  END IF;

  v_total := GREATEST(0, v_subtotal - v_discount + v_delivery_fee);
  v_order_number := 'SV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 5));

  -- Insert order
  INSERT INTO public.orders (
    order_number, user_id, customer_name, customer_email, customer_phone,
    shipping_address, city, postal_code, order_notes,
    payment_method, status, subtotal_pkr, discount_pkr, delivery_fee_pkr, total_pkr, coupon_code
  ) VALUES (
    v_order_number, v_user_id, TRIM(p_customer_name), TRIM(p_customer_email), TRIM(p_customer_phone),
    TRIM(p_shipping_address), TRIM(p_city), TRIM(COALESCE(p_postal_code, '')), TRIM(COALESCE(p_order_notes, '')),
    'Cash on Delivery (COD)', 'Pending', v_subtotal, v_discount, v_delivery_fee, v_total, v_applied_coupon
  ) RETURNING id INTO v_order_id;

  -- Insert order items & decrement variant stock + increment sales count
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items_snapshot)
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id, variant_id, product_name, product_image,
      size_eu, color_name, unit_price_pkr, quantity, line_total_pkr
    ) VALUES (
      v_order_id,
      (v_item ->> 'product_id')::uuid,
      (v_item ->> 'variant_id')::uuid,
      v_item ->> 'product_name',
      v_item ->> 'product_image',
      v_item ->> 'size_eu',
      v_item ->> 'color_name',
      (v_item ->> 'unit_price_pkr')::numeric,
      (v_item ->> 'quantity')::integer,
      (v_item ->> 'line_total_pkr')::numeric
    );

    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - (v_item ->> 'quantity')::integer
    WHERE id = (v_item ->> 'variant_id')::uuid;

    UPDATE public.products
    SET sales_count = sales_count + (v_item ->> 'quantity')::integer
    WHERE id = (v_item ->> 'product_id')::uuid;
  END LOOP;

  -- Clear user's persisted cart if authenticated
  IF v_user_id IS NOT NULL THEN
    DELETE FROM public.cart_items WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'status', 'Pending',
    'payment_method', 'Cash on Delivery (COD)',
    'customer_name', TRIM(p_customer_name),
    'customer_email', TRIM(p_customer_email),
    'customer_phone', TRIM(p_customer_phone),
    'shipping_address', TRIM(p_shipping_address),
    'city', TRIM(p_city),
    'postal_code', TRIM(COALESCE(p_postal_code, '')),
    'subtotal_pkr', v_subtotal,
    'discount_pkr', v_discount,
    'delivery_fee_pkr', v_delivery_fee,
    'total_pkr', v_total,
    'coupon_code', v_applied_coupon,
    'items', v_items_snapshot,
    'created_at', NOW()
  );
END;
$$;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- CATEGORIES (Public read active, Admin full write)
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- BRANDS (Public read active, Admin full write)
DROP POLICY IF EXISTS "Public read active brands" ON public.brands;
CREATE POLICY "Public read active brands"
  ON public.brands FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage brands" ON public.brands;
CREATE POLICY "Admin manage brands"
  ON public.brands FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PRODUCTS (Public read active, Admin full write)
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PRODUCT IMAGES
DROP POLICY IF EXISTS "Public read product images" ON public.product_images;
CREATE POLICY "Public read product images"
  ON public.product_images FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin manage product images" ON public.product_images;
CREATE POLICY "Admin manage product images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PRODUCT VARIANTS
DROP POLICY IF EXISTS "Public read product variants" ON public.product_variants;
CREATE POLICY "Public read product variants"
  ON public.product_variants FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage product variants" ON public.product_variants;
CREATE POLICY "Admin manage product variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- CART ITEMS
DROP POLICY IF EXISTS "Users manage own cart items" ON public.cart_items;
CREATE POLICY "Users manage own cart items"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- WISHLIST ITEMS
DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist_items;
CREATE POLICY "Users manage own wishlist"
  ON public.wishlist_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ADDRESSES
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- COUPONS (Admin manages; validation happens via SECURITY DEFINER RPC)
DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;
CREATE POLICY "Admin manage coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ORDERS (Customers read own orders only; Admins read & update all; creation via place_cod_order RPC)
DROP POLICY IF EXISTS "Customers read own orders" ON public.orders;
CREATE POLICY "Customers read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admin update orders" ON public.orders;
CREATE POLICY "Admin update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ORDER ITEMS
DROP POLICY IF EXISTS "Customers read own order items" ON public.order_items;
CREATE POLICY "Customers read own order items"
  ON public.order_items FOR SELECT
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- REVIEWS
DROP POLICY IF EXISTS "Public read approved reviews" ON public.reviews;
CREATE POLICY "Public read approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = TRUE OR auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users create reviews" ON public.reviews;
CREATE POLICY "Authenticated users create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users or admin manage reviews" ON public.reviews;
CREATE POLICY "Users or admin manage reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users or admin delete reviews" ON public.reviews;
CREATE POLICY "Users or admin delete reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- SITE SETTINGS
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings"
  ON public.site_settings FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin manage site settings" ON public.site_settings;
CREATE POLICY "Admin manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SUPABASE STORAGE BUCKET & POLICIES FOR PRODUCT IMAGES
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product-images bucket" ON storage.objects;
CREATE POLICY "Public read product-images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload product-images bucket" ON storage.objects;
CREATE POLICY "Admin upload product-images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update product-images bucket" ON storage.objects;
CREATE POLICY "Admin update product-images bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete product-images bucket" ON storage.objects;
CREATE POLICY "Admin delete product-images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- Grant execute permissions on RPCs to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT, NUMERIC) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_cod_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
