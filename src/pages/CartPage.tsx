import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { useStore } from '../context/StoreContext';
import { formatPKR, getEffectivePrice, getPrimaryImage } from '../utils/format';

export function CartPage() {
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    subtotalPkr,
    savingsPkr,
    siteSettings,
  } = useStore();

  const freeThreshold = siteSettings.shipping.free_threshold_pkr;
  const deliveryFee =
    subtotalPkr === 0 || subtotalPkr >= freeThreshold
      ? 0
      : siteSettings.shipping.flat_rate_pkr;

  return (
    <>
      <SeoHead
        title="Shopping Bag"
        description="Review your selected sneakers before checkout."
        canonicalPath="/cart"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#101114] dark:text-[#F5F3ED] mb-8">
          Shopping Bag
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-12 sm:p-16 text-center">
            <ShoppingBag
              className="w-12 h-12 text-[#C5C7CB] dark:text-white/30 mx-auto mb-4"
              strokeWidth={1.25}
            />
            <h2 className="font-editorial text-2xl font-semibold mb-2">
              Your bag is currently empty
            </h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] max-w-md mx-auto mb-8">
              Discover our curated collection of Italian calfskin court shoes and carbon-plated
              running sneakers.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.16em] hover:opacity-90"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 divide-y divide-[#EDEAE2] dark:divide-white/10">
              {cartItems.map((item) => {
                const unitPrice = getEffectivePrice(item.product);
                return (
                  <div
                    key={item.variant_id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                  >
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-32 aspect-[4/3] bg-[#EDEAE2] dark:bg-[#101114] border border-[#C5C7CB]/50 dark:border-white/10 shrink-0 overflow-hidden"
                    >
                      <SafeImage
                        src={getPrimaryImage(item.product)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">{item.product.brand}</p>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-base font-semibold hover:opacity-75"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1">
                        Size EU {item.variant.size_eu} · Color: {item.variant.color_name}
                      </p>
                      <p className="text-xs text-[#71717A] dark:text-[#C5C7CB]/70 mt-0.5 font-mono">
                        Unit: {formatPKR(unitPrice)} · Stock: {item.variant.stock_quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 self-end sm:self-center">
                      <div className="inline-flex items-center border border-[#C5C7CB]/60 dark:border-white/15 bg-[#F5F3ED] dark:bg-[#101114]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variant_id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-9 h-9 flex items-center justify-center hover:bg-[#EDEAE2] dark:hover:bg-white/10"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center font-mono tabular-nums text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variant_id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-9 h-9 flex items-center justify-center hover:bg-[#EDEAE2] dark:hover:bg-white/10"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="font-mono tabular-nums text-sm font-semibold">
                          {formatPKR(unitPrice * item.quantity)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variant_id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="p-2 text-[#71717A] dark:text-[#C5C7CB] hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:col-span-4 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 space-y-5">
              <h2 className="font-editorial text-xl font-semibold">Order Summary</h2>

              <div className="space-y-3 text-sm border-b border-[#EDEAE2] dark:border-white/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-[#52525B] dark:text-[#C5C7CB]">Subtotal</span>
                  <span className="font-mono tabular-nums font-medium">{formatPKR(subtotalPkr)}</span>
                </div>
                {savingsPkr > 0 && (
                  <div className="flex justify-between text-[#101114] dark:text-[#D7FF45]">
                    <span>Sale Savings</span>
                    <span className="font-mono tabular-nums">- {formatPKR(savingsPkr)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#52525B] dark:text-[#C5C7CB]">Delivery (COD)</span>
                  <span className="font-mono tabular-nums font-medium">
                    {deliveryFee === 0 ? 'Complimentary' : formatPKR(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-base font-semibold">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">{formatPKR(subtotalPkr + deliveryFee)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] hover:opacity-90 text-xs font-bold uppercase tracking-[0.16em] transition-opacity flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shop"
                className="block text-center text-xs font-medium text-[#52525B] dark:text-[#C5C7CB] hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
