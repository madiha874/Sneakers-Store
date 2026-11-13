import { requireSupabase } from '../lib/supabase';
import {
  Brand,
  Category,
  Coupon,
  Order,
  OrderStatus,
  Product,
  ProductVariant,
  Profile,
  Review,
  SiteSettings,
} from '../types';

export interface AdminOverviewStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenuePkr: number;
  pendingOrders: number;
  lowStockVariantsCount: number;
  recentOrders: Order[];
  monthlyRevenue: Array<{ label: string; revenue: number; orders: number }>;
}

export async function fetchAdminOverview(): Promise<AdminOverviewStats> {
  const client = requireSupabase();

  const [productsRes, ordersRes, profilesRes, lowStockRes] = await Promise.all([
    client.from('products').select('id', { count: 'exact', head: true }),
    client
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false }),
    client.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    client
      .from('product_variants')
      .select('id', { count: 'exact', head: true })
      .lte('stock_quantity', 5)
      .eq('is_active', true),
  ]);

  if (ordersRes.error) throw new Error(ordersRes.error.message);

  const orders = (ordersRes.data ?? []) as Order[];
  const validOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenuePkr = validOrders.reduce((sum, o) => sum + Number(o.total_pkr), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  const bucket = new Map<string, { revenue: number; orders: number }>();
  validOrders.slice(0, 60).forEach((o) => {
    const dt = new Date(o.created_at);
    const label = dt.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
    const prev = bucket.get(label) ?? { revenue: 0, orders: 0 };
    bucket.set(label, {
      revenue: prev.revenue + Number(o.total_pkr),
      orders: prev.orders + 1,
    });
  });

  const monthlyRevenue = Array.from(bucket.entries())
    .slice(0, 7)
    .reverse()
    .map(([label, val]) => ({ label, ...val }));

  return {
    totalProducts: productsRes.count ?? 0,
    totalOrders: orders.length,
    totalCustomers: profilesRes.count ?? 0,
    totalRevenuePkr,
    pendingOrders,
    lowStockVariantsCount: lowStockRes.count ?? 0,
    recentOrders: orders.slice(0, 8),
    monthlyRevenue,
  };
}

export async function adminFetchAllProducts(): Promise<Product[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('products')
    .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function adminSaveProduct(payload: {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  brand_id?: string | null;
  short_description: string;
  description: string;
  material_notes: string;
  category_id: string | null;
  gender: 'men' | 'women' | 'unisex';
  collection_type: Product['collection_type'];
  price_pkr: number;
  discount_price_pkr: number | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_exclusive: boolean;
  is_active: boolean;
}): Promise<Product> {
  const client = requireSupabase();
  const { id, ...fields } = payload;

  if (id) {
    const { data, error } = await client
      .from('products')
      .update(fields)
      .eq('id', id)
      .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
      .single();
    if (error) throw new Error(error.message);
    return data as Product;
  } else {
    const { data, error } = await client
      .from('products')
      .insert(fields)
      .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
      .single();
    if (error) throw new Error(error.message);
    return data as Product;
  }
}

export interface CsvImportRow {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category_slug: string;
  gender: 'men' | 'women' | 'unisex';
  collection_type: Product['collection_type'];
  price_pkr: number;
  discount_price_pkr: number | null;
  short_description: string;
  description: string;
  material_notes: string;
  sizes: string[];
  color_name: string;
  color_hex: string;
  stock_per_size: number;
  image_url?: string;
}

export interface BulkImportSummary {
  inserted: number;
  skippedDuplicates: string[];
  errors: string[];
}

export async function adminBulkImportProducts(rows: CsvImportRow[]): Promise<BulkImportSummary> {
  const client = requireSupabase();

  const [existingProdsRes, catsRes, brandsRes] = await Promise.all([
    client.from('products').select('slug, sku'),
    client.from('categories').select('id, slug'),
    client.from('brands').select('id, name, slug'),
  ]);

  if (existingProdsRes.error) throw new Error(existingProdsRes.error.message);
  if (catsRes.error) throw new Error(catsRes.error.message);

  const existingSlugs = new Set((existingProdsRes.data ?? []).map((p) => p.slug.toLowerCase()));
  const existingSkus = new Set((existingProdsRes.data ?? []).map((p) => p.sku.toLowerCase()));
  const catMap = new Map((catsRes.data ?? []).map((c) => [c.slug.toLowerCase(), c.id]));
  const brandMap = new Map(
    (brandsRes.data ?? []).map((b) => [b.name.toLowerCase(), b.id])
  );

  const summary: BulkImportSummary = {
    inserted: 0,
    skippedDuplicates: [],
    errors: [],
  };

  for (const row of rows) {
    const slug = row.slug.trim().toLowerCase();
    const sku = row.sku.trim().toUpperCase();
    if (!row.name.trim() || !slug || !sku) {
      summary.errors.push(`Missing name/slug/sku in row "${row.name || 'unnamed'}"`);
      continue;
    }

    if (existingSlugs.has(slug) || existingSkus.has(sku.toLowerCase())) {
      summary.skippedDuplicates.push(`${row.name} (${sku})`);
      continue;
    }

    const categoryId = catMap.get(row.category_slug.toLowerCase()) ?? null;
    const brandId = brandMap.get(row.brand.toLowerCase()) ?? null;

    const { data: prod, error: prodErr } = await client
      .from('products')
      .insert({
        name: row.name.trim(),
        slug,
        sku,
        brand: row.brand.trim() || 'SOLEVERSE Atelier',
        brand_id: brandId,
        category_id: categoryId,
        gender: row.gender || 'unisex',
        collection_type: row.collection_type || 'casual',
        price_pkr: Number(row.price_pkr) || 25000,
        discount_price_pkr: row.discount_price_pkr ? Number(row.discount_price_pkr) : null,
        short_description: row.short_description || row.name,
        description: row.description || row.short_description || row.name,
        material_notes: row.material_notes || 'Premium leather & sculpted rubber cupsole',
        is_new_arrival: true,
        is_active: true,
      })
      .select('id')
      .single();

    if (prodErr || !prod) {
      summary.errors.push(`${row.name}: ${prodErr?.message ?? 'Insert failed'}`);
      continue;
    }

    existingSlugs.add(slug);
    existingSkus.add(sku.toLowerCase());

    const imgUrl =
      row.image_url?.trim() || '/images/sneakers/sv-01-obsidian-apex-low.jpg';
    await client.from('product_images').insert({
      product_id: prod.id,
      image_url: imgUrl,
      alt_text: `${row.name} studio image`,
      is_primary: true,
      display_order: 0,
    });

    const sizes = row.sizes.length > 0 ? row.sizes : ['40', '41', '42', '43', '44'];
    const variantsPayload = sizes.map((size) => ({
      product_id: prod.id,
      size_eu: size.trim(),
      color_name: row.color_name || 'Obsidian',
      color_hex: row.color_hex || '#101114',
      sku_variant: `${sku}-${size.trim()}-1`,
      stock_quantity: Math.max(0, Number(row.stock_per_size) || 10),
      is_active: true,
    }));

    await client.from('product_variants').insert(variantsPayload);
    summary.inserted += 1;
  }

  return summary;
}

export async function adminDeleteProduct(productId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('products').delete().eq('id', productId);
  if (error) throw new Error(error.message);
}

export async function adminUploadProductImage(file: File, slug: string): Promise<string> {
  const client = requireSupabase();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filePath = `products/${slug}-${Date.now()}.${ext}`;

  const { error: uploadError } = await client.storage
    .from('product-images')
    .upload(filePath, file, { upsert: false });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data } = client.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function adminAddProductImageRecord(payload: {
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}) {
  const client = requireSupabase();
  if (payload.is_primary) {
    await client
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', payload.product_id);
  }
  const { data, error } = await client
    .from('product_images')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminDeleteProductImage(imageId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('product_images').delete().eq('id', imageId);
  if (error) throw new Error(error.message);
}

export async function adminUpsertVariant(
  variant: Omit<ProductVariant, 'id'> & { id?: string }
): Promise<ProductVariant> {
  const client = requireSupabase();
  const { id, ...fields } = variant;
  if (id) {
    const { data, error } = await client
      .from('product_variants')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ProductVariant;
  } else {
    const { data, error } = await client
      .from('product_variants')
      .insert(fields)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ProductVariant;
  }
}

export async function adminUpdateVariantStock(variantId: string, stockQuantity: number) {
  const client = requireSupabase();
  const { error } = await client
    .from('product_variants')
    .update({ stock_quantity: Math.max(0, stockQuantity) })
    .eq('id', variantId);
  if (error) throw new Error(error.message);
}

export async function adminDeleteVariant(variantId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('product_variants').delete().eq('id', variantId);
  if (error) throw new Error(error.message);
}

export async function adminFetchCategories(): Promise<Category[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function adminSaveCategory(
  category: Omit<Category, 'id' | 'created_at'> & { id?: string }
): Promise<Category> {
  const client = requireSupabase();
  const { id, ...fields } = category;
  if (id) {
    const { data, error } = await client
      .from('categories')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  } else {
    const { data, error } = await client.from('categories').insert(fields).select().single();
    if (error) throw new Error(error.message);
    return data as Category;
  }
}

export async function adminDeleteCategory(categoryId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('categories').delete().eq('id', categoryId);
  if (error) throw new Error(error.message);
}

export async function adminFetchBrands(): Promise<Brand[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Brand[];
}

export async function adminSaveBrand(
  brand: Omit<Brand, 'id' | 'created_at'> & { id?: string }
): Promise<Brand> {
  const client = requireSupabase();
  const { id, ...fields } = brand;
  if (id) {
    const { data, error } = await client
      .from('brands')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Brand;
  } else {
    const { data, error } = await client.from('brands').insert(fields).select().single();
    if (error) throw new Error(error.message);
    return data as Brand;
  }
}

export async function adminDeleteBrand(brandId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('brands').delete().eq('id', brandId);
  if (error) throw new Error(error.message);
}

export async function adminFetchOrders(): Promise<Order[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

export async function adminUpdateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('orders').update({ status }).eq('id', orderId);
  if (error) throw new Error(error.message);
}

export async function adminFetchCustomers(): Promise<Profile[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Profile[];
}

export async function adminFetchReviews(): Promise<Review[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

export async function adminToggleReviewApproval(reviewId: string, isApproved: boolean) {
  const client = requireSupabase();
  const { error } = await client
    .from('reviews')
    .update({ is_approved: isApproved })
    .eq('id', reviewId);
  if (error) throw new Error(error.message);
}

export async function adminFetchCoupons(): Promise<Coupon[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Coupon[];
}

export async function adminSaveCoupon(
  coupon: Omit<Coupon, 'id' | 'used_count' | 'created_at'> & { id?: string }
): Promise<Coupon> {
  const client = requireSupabase();
  const { id, ...fields } = coupon;
  if (id) {
    const { data, error } = await client
      .from('coupons')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Coupon;
  } else {
    const { data, error } = await client.from('coupons').insert(fields).select().single();
    if (error) throw new Error(error.message);
    return data as Coupon;
  }
}

export async function adminDeleteCoupon(couponId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('coupons').delete().eq('id', couponId);
  if (error) throw new Error(error.message);
}

export async function adminSaveSiteSettings(settings: SiteSettings): Promise<void> {
  const client = requireSupabase();
  const entries = [
    { key: 'announcement', value: settings.announcement },
    { key: 'shipping', value: settings.shipping },
    { key: 'store', value: settings.store },
  ];
  const { error } = await client.from('site_settings').upsert(entries, { onConflict: 'key' });
  if (error) throw new Error(error.message);
}
