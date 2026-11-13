import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, GitCompareArrows, Heart, ShoppingBag, Star, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  formatPKR,
  getDiscountPercent,
  getEffectivePrice,
  getPrimaryImage,
} from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

export function QuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [adding, setAdding] = useState(false);

  const colors = useMemo(() => {
    if (!quickViewProduct) return [];
    return Array.from(
      new Map(
        quickViewProduct.variants
          .filter((v) => v.is_active)
          .map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])
      ).values()
    );
  }, [quickViewProduct]);

  const sizesForColor = useMemo(() => {
    if (!quickViewProduct) return [];
    return quickViewProduct.variants.filter(
      (v) => v.is_active && (!selectedColor || v.color_name === selectedColor)
    );
  }, [quickViewProduct, selectedColor]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const firstActive =
      quickViewProduct.variants.find((v) => v.is_active && v.stock_quantity > 0) ??
      quickViewProduct.variants[0];
    setSelectedColor(firstActive?.color_name ?? '');
    setSelectedSize(firstActive?.size_eu ?? '');
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewProduct, closeQuickView]);

  const activeVariant = sizesForColor.find((v) => v.size_eu === selectedSize) ?? sizesForColor[0];

  const handleAddToBag = async () => {
    if (!quickViewProduct || !activeVariant) return;
    setAdding(true);
    const ok = await addToCart(quickViewProduct, activeVariant, 1);
    setAdding(false);
    if (ok) closeQuickView();
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          onClick={closeQuickView}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view ${quickViewProduct.name}`}
            className="w-full max-w-3xl bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
          >
            {/* Image column */}
            <div className="md:col-span-6 relative bg-[#EDEAE2] dark:bg-[#101114] aspect-[4/3] md:aspect-auto">
              <SafeImage
                src={getPrimaryImage(quickViewProduct)}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
              {getDiscountPercent(quickViewProduct) > 0 && (
                <span className="absolute top-3 left-3 bg-[#D7FF45] text-[#101114] text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1">
                  Save {getDiscountPercent(quickViewProduct)}%
                </span>
              )}
            </div>

            {/* Info column */}
            <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between gap-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#52525B] dark:text-[#C5C7CB]">
                      {quickViewProduct.brand} · {quickViewProduct.sku}
                    </p>
                    <h2 className="font-editorial text-2xl font-semibold text-[#101114] dark:text-[#F5F3ED] mt-1">
                      {quickViewProduct.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeQuickView}
                    aria-label="Close quick view"
                    className="p-2 text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono tabular-nums text-lg font-semibold text-[#101114] dark:text-[#D7FF45]">
                      {formatPKR(getEffectivePrice(quickViewProduct))}
                    </span>
                    {getDiscountPercent(quickViewProduct) > 0 && (
                      <span className="font-mono tabular-nums text-xs text-[#71717A] dark:text-[#C5C7CB]/60 line-through">
                        {formatPKR(quickViewProduct.price_pkr)}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-[#101114] dark:text-[#F5F3ED]">
                    <Star className="w-3.5 h-3.5 fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45]" />
                    {quickViewProduct.rating_avg.toFixed(1)}
                  </span>
                </div>

                <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-3 leading-relaxed">
                  {quickViewProduct.short_description}
                </p>

                {/* Colorway */}
                {colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] mb-2">
                      Colorway: <strong className="text-[#101114] dark:text-[#F5F3ED]">{selectedColor}</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSelectedColor(col.name)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border text-xs transition-colors ${
                            selectedColor === col.name
                              ? 'border-[#101114] dark:border-[#D7FF45] bg-[#EDEAE2] dark:bg-white/10 text-[#101114] dark:text-[#F5F3ED]'
                              : 'border-[#C5C7CB]/60 dark:border-white/10 text-[#52525B] dark:text-[#C5C7CB]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: col.hex }}
                          />
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] mb-2">
                    Select EU Size
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {sizesForColor.map((v) => {
                      const out = v.stock_quantity <= 0;
                      const active = selectedSize === v.size_eu;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={out}
                          onClick={() => setSelectedSize(v.size_eu)}
                          className={`py-2 text-xs font-mono font-medium border transition-colors ${
                            out
                              ? 'opacity-35 line-through border-[#C5C7CB]/40 dark:border-white/10 cursor-not-allowed'
                              : active
                                ? 'bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] border-[#101114] dark:border-[#D7FF45] font-bold'
                                : 'border-[#C5C7CB]/60 dark:border-white/15 text-[#101114] dark:text-[#F5F3ED] hover:border-[#101114] dark:hover:border-white'
                          }`}
                        >
                          {v.size_eu}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2 border-t border-[#C5C7CB]/40 dark:border-white/10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={adding || !activeVariant || activeVariant.stock_quantity <= 0}
                    onClick={handleAddToBag}
                    className="flex-1 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity disabled:opacity-40 inline-flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {activeVariant && activeVariant.stock_quantity > 0
                      ? adding
                        ? 'Adding...'
                        : 'Add To Bag'
                      : 'Out of Stock'}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(quickViewProduct)}
                    aria-label="Toggle wishlist"
                    className="w-11 border border-[#C5C7CB]/60 dark:border-white/15 flex items-center justify-center text-[#101114] dark:text-[#F5F3ED] hover:border-[#101114] dark:hover:border-[#D7FF45]"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(quickViewProduct.id)
                          ? 'fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45]'
                          : ''
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompare(quickViewProduct)}
                    aria-label="Toggle compare"
                    className={`w-11 border flex items-center justify-center transition-colors ${
                      isInCompare(quickViewProduct.id)
                        ? 'border-[#101114] dark:border-[#D7FF45] bg-[#D7FF45] text-[#101114]'
                        : 'border-[#C5C7CB]/60 dark:border-white/15 text-[#101114] dark:text-[#F5F3ED]'
                    }`}
                  >
                    <GitCompareArrows className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  to={`/product/${quickViewProduct.slug}`}
                  onClick={closeQuickView}
                  className="block w-full text-center text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-[#D7FF45] py-1 inline-flex items-center justify-center gap-1"
                >
                  View Full Technical Dossier & Reviews
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
