import { Product } from '../types';

export function formatPKR(amount: number | string | null | undefined): string {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) return 'PKR 0';
  return `PKR ${Math.round(num).toLocaleString('en-PK')}`;
}

export function getEffectivePrice(product: Pick<Product, 'price_pkr' | 'discount_price_pkr'>): number {
  if (
    product.discount_price_pkr !== null &&
    product.discount_price_pkr !== undefined &&
    product.discount_price_pkr > 0 &&
    product.discount_price_pkr < product.price_pkr
  ) {
    return Number(product.discount_price_pkr);
  }
  return Number(product.price_pkr);
}

export function getDiscountPercent(product: Pick<Product, 'price_pkr' | 'discount_price_pkr'>): number {
  const effective = getEffectivePrice(product);
  if (effective >= product.price_pkr || product.price_pkr <= 0) return 0;
  return Math.round(((product.price_pkr - effective) / product.price_pkr) * 100);
}

export function getPrimaryImage(product: Product): string {
  if (!product.images || product.images.length === 0) {
    return '/images/banners/hero-flagship.jpg';
  }
  const sorted = [...product.images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.display_order - b.display_order;
  });
  return sorted[0].image_url;
}

export function getSecondaryImage(product: Product): string {
  if (!product.images || product.images.length < 2) {
    return getPrimaryImage(product);
  }
  const sorted = [...product.images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.display_order - b.display_order;
  });
  return sorted[1].image_url;
}

export function getTotalStock(product: Product): number {
  if (!product.variants) return 0;
  return product.variants.reduce((sum, v) => sum + (v.is_active ? v.stock_quantity : 0), 0);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(dateIso: string): string {
  try {
    return new Intl.DateTimeFormat('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateIso));
  } catch {
    return dateIso;
  }
}
