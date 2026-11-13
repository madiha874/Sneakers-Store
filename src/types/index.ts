export type UserRole = 'customer' | 'admin';
export type ThemeMode = 'light' | 'dark';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type ParentCategoryGroup = 'men' | 'women' | 'running' | 'sports' | 'lifestyle';

export type CollectionType =
  | 'casual'
  | 'running'
  | 'sports'
  | 'training'
  | 'lifestyle'
  | 'walking'
  | 'high-top'
  | 'low-top';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_group: ParentCategoryGroup;
  description: string;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin?: string;
  logo_url?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size_eu: string;
  color_name: string;
  color_hex: string;
  sku_variant: string;
  stock_quantity: number;
  price_override_pkr?: number | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  brand_id?: string | null;
  short_description: string;
  description: string;
  material_notes: string;
  category_id: string | null;
  category?: Category | null;
  gender: 'men' | 'women' | 'unisex';
  collection_type: CollectionType;
  price_pkr: number;
  discount_price_pkr: number | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_exclusive: boolean;
  is_active: boolean;
  rating_avg: number;
  review_count: number;
  sales_count: number;
  created_at: string;
  updated_at?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_pkr: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_image: string;
  size_eu: string;
  color_name: string;
  unit_price_pkr: number;
  quantity: number;
  line_total_pkr: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  order_notes: string;
  payment_method: string;
  status: OrderStatus;
  subtotal_pkr: number;
  discount_pkr: number;
  delivery_fee_pkr: number;
  total_pkr: number;
  coupon_code: string | null;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  author_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  announcement: {
    enabled: boolean;
    text: string;
    link_url: string;
  };
  shipping: {
    flat_rate_pkr: number;
    free_threshold_pkr: number;
    estimated_days: string;
  };
  store: {
    name: string;
    support_email: string;
    support_phone: string;
    whatsapp_number: string;
    instagram_url: string;
    flagship_city: string;
  };
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'bestselling'
  | 'rating';

export interface ProductFilterState {
  search: string;
  categorySlug?: string;
  gender?: 'men' | 'women' | 'unisex' | '';
  collectionType?: CollectionType | '';
  brand?: string;
  sizeEu?: string;
  colorName?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  minRating?: number;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isExclusive?: boolean;
  sort: SortOption;
}
