import { Eye, GitCompareArrows, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  formatPKR,
  getDiscountPercent,
  getEffectivePrice,
  getPrimaryImage,
  getSecondaryImage,
  getTotalStock,
} from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    isInWishlist,
    toggleWishlist,
    isInCompare,
    toggleCompare,
    openQuickView,
    addToCart,
  } = useStore();

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  const primaryImg = getPrimaryImage(product);
  const secondaryImg = getSecondaryImage(product);
  const effectivePrice = getEffectivePrice(product);
  const discountPct = getDiscountPercent(product);
  const totalStock = getTotalStock(product);

  const uniqueColors = Array.from(
    new Map(
      product.variants
        .filter((v) => v.is_active)
        .map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])
    ).values()
  );

  const availableSizes = Array.from(
    new Set(
      product.variants
        .filter((v) => v.is_active && v.stock_quantity > 0)
        .map((v) => Number(v.size_eu))
    )
  ).sort((a, b) => a - b);

  const firstAvailableVariant =
    product.variants.find((v) => v.is_active && v.stock_quantity > 0) ?? null;

  let statusKicker = '';
  let useLime = false;
  if (totalStock === 0) {
    statusKicker = 'Sold Out';
  } else if (discountPct > 0) {
    statusKicker = `Save ${discountPct}%`;
    useLime = true;
  } else if (product.is_exclusive) {
    statusKicker = 'Atelier Reserve';
  } else if (product.is_new_arrival) {
    statusKicker = 'New Arrival';
    useLime = true;
  } else if (product.is_bestseller) {
    statusKicker = 'Best Seller';
  }

  return (
    <article className="group flex flex-col bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,17,20,0.09)] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EDEAE2] dark:bg-[#101114]">
        <Link
          to={`/product/${product.slug}`}
          className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101114] dark:focus-visible:ring-[#D7FF45]"
          aria-label={`View ${product.name}`}
        >
          <SafeImage
            src={primaryImg}
            alt={product.name}
            fallbackTitle={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {secondaryImg !== primaryImg && (
            <SafeImage
              src={secondaryImg}
              alt={`${product.name} detail angle`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </Link>

        {statusKicker && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 ${
              totalStock === 0
                ? 'bg-[#101114] text-[#F5F3ED]'
                : useLime
                  ? 'bg-[#D7FF45] text-[#101114]'
                  : 'bg-[#101114]/90 dark:bg-[#F5F3ED]/90 text-[#F5F3ED] dark:text-[#101114]'
            }`}
          >
            {statusKicker}
          </span>
        )}

        {/* Top-right Wishlist + Compare actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={
              wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
            }
            className="w-9 h-9 flex items-center justify-center bg-[#F5F3ED]/95 dark:bg-[#202126]/95 hover:bg-white dark:hover:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] border border-black/10 dark:border-white/10 transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                wishlisted
                  ? 'fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45] scale-110'
                  : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => toggleCompare(product)}
            aria-label={`Compare ${product.name}`}
            title={compared ? 'Remove from comparison' : 'Compare sneaker'}
            className={`w-9 h-9 flex items-center justify-center border transition-colors ${
              compared
                ? 'bg-[#D7FF45] text-[#101114] border-[#101114]/20'
                : 'bg-[#F5F3ED]/95 dark:bg-[#202126]/95 hover:bg-white dark:hover:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] border-black/10 dark:border-white/10 sm:opacity-0 sm:group-hover:opacity-100'
            }`}
          >
            <GitCompareArrows className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover Quick Action Bar (Quick View + Quick Add) */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-center gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="flex-1 py-2 bg-[#F5F3ED] dark:bg-[#202126] text-[#101114] dark:text-[#F5F3ED] text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-white dark:hover:bg-[#101114] inline-flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            type="button"
            disabled={!firstAvailableVariant}
            onClick={() => firstAvailableVariant && addToCart(product, firstAvailableVariant, 1)}
            className="flex-1 py-2 bg-[#D7FF45] text-[#101114] text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 disabled:opacity-40 inline-flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
            <span className="truncate">
              {product.brand} · {product.category?.name ?? product.collection_type}
            </span>
            <span className="inline-flex items-center gap-1 shrink-0 font-mono tabular-nums text-[#101114] dark:text-[#F5F3ED]">
              <Star className="w-3 h-3 fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45]" />
              {product.rating_avg.toFixed(1)}
            </span>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="block text-base font-semibold text-[#101114] dark:text-[#F5F3ED] hover:opacity-75 transition-opacity line-clamp-1"
          >
            {product.name}
          </Link>

          <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]/80 mt-1 line-clamp-1">
            {product.short_description}
          </p>

          {availableSizes.length > 0 && (
            <p className="text-[11px] font-mono text-[#52525B] dark:text-[#C5C7CB]/70 mt-1.5">
              EU {availableSizes[0]}–{availableSizes[availableSizes.length - 1]} ({availableSizes.length} sizes)
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-[#EDEAE2] dark:border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-sm font-semibold text-[#101114] dark:text-[#F5F3ED]">
              {formatPKR(effectivePrice)}
            </span>
            {discountPct > 0 && (
              <span className="font-mono tabular-nums text-xs text-[#71717A] dark:text-[#C5C7CB]/50 line-through">
                {formatPKR(product.price_pkr)}
              </span>
            )}
          </div>

          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5" aria-label="Available colorways">
              {uniqueColors.slice(0, 3).map((col) => (
                <span
                  key={col.name}
                  title={col.name}
                  className="w-3 h-3 rounded-full border border-black/20 dark:border-white/30"
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
