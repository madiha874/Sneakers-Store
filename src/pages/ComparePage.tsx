import { ArrowRight, GitCompareArrows, ShoppingBag, Star, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { useStore } from '../context/StoreContext';
import {
  formatPKR,
  getDiscountPercent,
  getEffectivePrice,
  getPrimaryImage,
  getTotalStock,
} from '../utils/format';

export function ComparePage() {
  const { compareProducts, toggleCompare, clearCompare, addToCart } = useStore();

  return (
    <>
      <SeoHead
        title="Compare Sneakers"
        description="Compare SOLEVERSE sneaker silhouettes side by side across pricing, sizing, materials, and performance ratings."
        canonicalPath="/compare"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="pb-8 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
              Technical Comparison
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Compare Sneakers ({compareProducts.length}/3)
            </h1>
          </div>

          {compareProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="px-4 py-2 border border-[#C5C7CB]/60 dark:border-white/15 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                Add Another
              </Link>
              <button
                type="button"
                onClick={clearCompare}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-400/50 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-14 text-center max-w-xl mx-auto">
            <GitCompareArrows className="w-10 h-10 text-[#C5C7CB] dark:text-white/30 mx-auto mb-4" />
            <h2 className="font-editorial text-2xl font-semibold mb-2">
              No Sneakers Selected for Comparison
            </h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mb-6">
              Tap the compare icon on any sneaker card to analyze up to three models side by side.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
            >
              Browse Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-[#C5C7CB]/60 dark:border-white/10">
                  <th className="w-44 p-5 text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] align-top">
                    Specification
                  </th>
                  {compareProducts.map((p) => {
                    const firstAvail = p.variants.find((v) => v.is_active && v.stock_quantity > 0);
                    return (
                      <th key={p.id} className="p-5 align-top border-l border-[#EDEAE2] dark:border-white/10">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleCompare(p)}
                            aria-label={`Remove ${p.name}`}
                            className="absolute top-2 right-2 z-10 w-7 h-7 bg-[#101114]/85 text-white flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/product/${p.slug}`}
                            className="block aspect-[4/3] bg-[#EDEAE2] dark:bg-[#101114] mb-3 overflow-hidden"
                          >
                            <SafeImage
                              src={getPrimaryImage(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          <p className="text-[11px] uppercase tracking-wider text-[#52525B] dark:text-[#D7FF45] font-normal">
                            {p.brand}
                          </p>
                          <Link
                            to={`/product/${p.slug}`}
                            className="font-editorial text-lg font-semibold text-[#101114] dark:text-[#F5F3ED] hover:underline block mb-3"
                          >
                            {p.name}
                          </Link>
                          <button
                            type="button"
                            disabled={!firstAvail}
                            onClick={() => firstAvail && addToCart(p, firstAvail, 1)}
                            className="w-full py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {firstAvail ? `Quick Add (EU ${firstAvail.size_eu})` : 'Sold Out'}
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEAE2] dark:divide-white/10 text-sm">
                <tr>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    Price
                  </td>
                  {compareProducts.map((p) => {
                    const eff = getEffectivePrice(p);
                    const disc = getDiscountPercent(p);
                    return (
                      <td key={p.id} className="p-4 border-l border-[#EDEAE2] dark:border-white/10 font-mono">
                        <span className="font-semibold text-[#101114] dark:text-[#D7FF45]">
                          {formatPKR(eff)}
                        </span>
                        {disc > 0 && (
                          <span className="ml-2 text-xs text-[#71717A] line-through">
                            {formatPKR(p.price_pkr)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    Discipline
                  </td>
                  {compareProducts.map((p) => (
                    <td
                      key={p.id}
                      className="p-4 border-l border-[#EDEAE2] dark:border-white/10 capitalize"
                    >
                      {p.category?.name ?? p.collection_type} · {p.gender}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    Collector Rating
                  </td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#EDEAE2] dark:border-white/10 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45]" />
                        {p.rating_avg.toFixed(2)} ({p.review_count} reviews)
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    Available Sizes (EU)
                  </td>
                  {compareProducts.map((p) => {
                    const sizes = Array.from(
                      new Set(
                        p.variants
                          .filter((v) => v.is_active && v.stock_quantity > 0)
                          .map((v) => v.size_eu)
                      )
                    ).sort((a, b) => Number(a) - Number(b));
                    return (
                      <td key={p.id} className="p-4 border-l border-[#EDEAE2] dark:border-white/10 font-mono text-xs">
                        {sizes.length > 0 ? sizes.join(', ') : 'Sold Out'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    Stock Status
                  </td>
                  {compareProducts.map((p) => {
                    const stock = getTotalStock(p);
                    return (
                      <td key={p.id} className="p-4 border-l border-[#EDEAE2] dark:border-white/10 font-mono text-xs">
                        {stock > 0 ? `${stock} pairs ready` : 'Out of Stock'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    Craftsmanship & Spec
                  </td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#EDEAE2] dark:border-white/10 text-xs text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
                      {p.material_notes}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
