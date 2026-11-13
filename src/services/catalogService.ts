import {
  DEFAULT_SITE_SETTINGS,
  SEED_BRANDS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from '../data/catalogSeed';
import { isSupabaseConfigured, requireSupabase, supabase } from '../lib/supabase';
import { Brand, Category, Product, ProductFilterState, SiteSettings } from '../types';
import { getEffectivePrice, getTotalStock } from '../utils/format';

export interface CatalogResult {
  products: Product[];
  source: 'supabase' | 'preview';
}

export interface PaginatedCatalogResult {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  source: 'supabase' | 'preview';
}

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*),
  variants:product_variants(*)
`;

export function filterAndSortProducts(
  products: Product[],
  filters: Partial<ProductFilterState>
): Product[] {
  let result = [...products];

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        (p.category?.name.toLowerCase().includes(q) ?? false) ||
        p.collection_type.toLowerCase().includes(q)
    );
  }

  if (filters.categorySlug) {
    result = result.filter((p) => p.category?.slug === filters.categorySlug);
  }

  if (filters.gender) {
    result = result.filter((p) => p.gender === filters.gender || p.gender === 'unisex');
  }

  if (filters.collectionType) {
    result = result.filter((p) => p.collection_type === filters.collectionType);
  }

  if (filters.brand) {
    result = result.filter(
      (p) =>
        p.brand.toLowerCase() === filters.brand!.toLowerCase() ||
        p.brand.toLowerCase().replace(/\s+/g, '-') === filters.brand!.toLowerCase()
    );
  }

  if (filters.sizeEu) {
    result = result.filter((p) =>
      p.variants.some((v) => v.is_active && v.size_eu === filters.sizeEu && v.stock_quantity > 0)
    );
  }

  if (filters.colorName) {
    const target = filters.colorName.toLowerCase();
    result = result.filter((p) =>
      p.variants.some((v) => v.is_active && v.color_name.toLowerCase().includes(target))
    );
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    result = result.filter((p) => getEffectivePrice(p) >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    result = result.filter((p) => getEffectivePrice(p) <= filters.maxPrice!);
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => getTotalStock(p) > 0);
  }

  if (filters.onSaleOnly) {
    result = result.filter(
      (p) => p.discount_price_pkr !== null && p.discount_price_pkr < p.price_pkr
    );
  }

  if (filters.minRating !== undefined && filters.minRating > 0) {
    result = result.filter((p) => p.rating_avg >= filters.minRating!);
  }

  if (filters.isNewArrival) result = result.filter((p) => p.is_new_arrival);
  if (filters.isBestseller) result = result.filter((p) => p.is_bestseller);
  if (filters.isFeatured) result = result.filter((p) => p.is_featured);
  if (filters.isTrending) result = result.filter((p) => p.is_trending);
  if (filters.isExclusive) result = result.filter((p) => p.is_exclusive);

  const sort = filters.sort ?? 'featured';
  result.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return getEffectivePrice(a) - getEffectivePrice(b);
      case 'price_desc':
        return getEffectivePrice(b) - getEffectivePrice(a);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'bestselling':
        return b.sales_count - a.sales_count;
      case 'rating':
        return b.rating_avg - a.rating_avg;
      case 'featured':
      default:
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return b.sales_count - a.sales_count;
    }
  });

  return result;
}

export async function fetchPaginatedProducts(
  filters: Partial<ProductFilterState>,
  page = 1,
  pageSize = 12
): Promise<PaginatedCatalogResult> {
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);

  if (!isSupabaseConfigured || !supabase) {
    const filtered = filterAndSortProducts(SEED_PRODUCTS, filters);
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / safeSize));
    const boundedPage = Math.min(safePage, totalPages);
    const start = (boundedPage - 1) * safeSize;
    return {
      products: filtered.slice(start, start + safeSize),
      totalCount,
      page: boundedPage,
      pageSize: safeSize,
      totalPages,
      source: 'preview',
    };
  }

  // Server-side Supabase query with .range(from, to) and exact count
  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('is_active', true);

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    query = query.or(
      `name.ilike.%${q}%,brand.ilike.%${q}%,sku.ilike.%${q}%,short_description.ilike.%${q}%`
    );
  }
  if (filters.gender) {
    query = query.in('gender', [filters.gender, 'unisex']);
  }
  if (filters.collectionType) {
    query = query.eq('collection_type', filters.collectionType);
  }
  if (filters.brand) {
    query = query.eq('brand', filters.brand);
  }
  if (filters.onSaleOnly) {
    query = query.not('discount_price_pkr', 'is', null);
  }
  if (filters.isNewArrival) query = query.eq('is_new_arrival', true);
  if (filters.isBestseller) query = query.eq('is_bestseller', true);
  if (filters.isFeatured) query = query.eq('is_featured', true);
  if (filters.isTrending) query = query.eq('is_trending', true);
  if (filters.isExclusive) query = query.eq('is_exclusive', true);
  if (filters.minRating && filters.minRating > 0) {
    query = query.gte('rating_avg', filters.minRating);
  }
  if (filters.minPrice && filters.minPrice > 0) {
    query = query.gte('price_pkr', filters.minPrice);
  }
  if (filters.maxPrice && filters.maxPrice > 0) {
    query = query.lte('price_pkr', filters.maxPrice);
  }

  const sort = filters.sort ?? 'featured';
  if (sort === 'price_asc') {
    query = query.order('price_pkr', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price_pkr', { ascending: false });
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'bestselling') {
    query = query.order('sales_count', { ascending: false });
  } else if (sort === 'rating') {
    query = query.order('rating_avg', { ascending: false });
  } else {
    query = query
      .order('is_featured', { ascending: false })
      .order('sales_count', { ascending: false });
  }

  // Note: nested variant/category filters (categorySlug, sizeEu, colorName, inStockOnly) require variant/category inspection;
  // when none are set, slice strictly on the DB server with .range().
  const hasRelationalFilter = Boolean(
    filters.categorySlug || filters.sizeEu || filters.colorName || filters.inStockOnly
  );

  if (!hasRelationalFilter) {
    const from = (safePage - 1) * safeSize;
    const to = from + safeSize - 1;
    const { data, count, error } = await query.range(from, to);
    if (error) {
      throw new Error(`Failed to fetch paginated products: ${error.message}`);
    }
    const totalCount = count ?? (data?.length ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / safeSize));
    return {
      products: (data ?? []) as Product[],
      totalCount,
      page: safePage,
      pageSize: safeSize,
      totalPages,
      source: 'supabase',
    };
  }

  // Relational variant/category filter refinement bounded via server query
  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch filtered products: ${error.message}`);
  }
  const filtered = filterAndSortProducts((data ?? []) as Product[], filters);
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safeSize));
  const boundedPage = Math.min(safePage, totalPages);
  const start = (boundedPage - 1) * safeSize;
  return {
    products: filtered.slice(start, start + safeSize),
    totalCount,
    page: boundedPage,
    pageSize: safeSize,
    totalPages,
    source: 'supabase',
  };
}

export async function fetchAllProducts(): Promise<CatalogResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { products: SEED_PRODUCTS, source: 'preview' };
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load products from Supabase: ${error.message}`);
  }

  return {
    products: (data ?? []) as Product[],
    source: 'supabase',
  };
}

export async function fetchProductBySlug(
  slug: string
): Promise<{ product: Product | null; source: 'supabase' | 'preview' }> {
  if (!isSupabaseConfigured || !supabase) {
    const found = SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
    return { product: found, source: 'preview' };
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch sneaker details: ${error.message}`);
  }

  return { product: (data as Product | null) ?? null, source: 'supabase' };
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return SEED_CATEGORIES;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  return (data ?? []) as Category[];
}

export async function fetchBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured || !supabase) {
    return SEED_BRANDS;
  }

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    return SEED_BRANDS;
  }

  return (data && data.length > 0 ? data : SEED_BRANDS) as Brand[];
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_SITE_SETTINGS;
  }

  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error || !data || data.length === 0) {
    return DEFAULT_SITE_SETTINGS;
  }

  const map = new Map(data.map((row) => [row.key, row.value]));
  return {
    announcement: {
      ...DEFAULT_SITE_SETTINGS.announcement,
      ...(map.get('announcement') ?? {}),
    },
    shipping: {
      ...DEFAULT_SITE_SETTINGS.shipping,
      ...(map.get('shipping') ?? {}),
    },
    store: {
      ...DEFAULT_SITE_SETTINGS.store,
      ...(map.get('store') ?? {}),
    },
  };
}

export async function fetchProductReviews(productId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function submitProductReview(payload: {
  productId: string;
  userId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
}) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('reviews')
    .insert({
      product_id: payload.productId,
      user_id: payload.userId,
      author_name: payload.authorName,
      rating: payload.rating,
      title: payload.title,
      comment: payload.comment,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
