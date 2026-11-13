import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPKR, getEffectivePrice, getPrimaryImage } from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateCartQuantity,
    removeFromCart,
    subtotalPkr,
    savingsPkr,
    siteSettings,
  } = useStore();

  const freeThreshold = siteSettings.shipping.free_threshold_pkr;
  const remainingForFree = Math.max(0, freeThreshold - subtotalPkr);
  const progressPct = Math.min(100, Math.round((subtotalPkr / freeThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            aria-label="Shopping bag"
            className="relative w-full max-w-md bg-[#F5F3ED] dark:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] border-l border-[#C5C7CB]/60 dark:border-white/10 h-full shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#C5C7CB]/60 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#202126]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#101114] dark:text-[#D7FF45]" strokeWidth={1.75} />
                <h2 className="font-editorial text-lg font-semibold">
                  Shopping Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close shopping bag"
                className="w-9 h-9 flex items-center justify-center text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free delivery meter */}
            {cartItems.length > 0 && (
              <div className="px-6 py-3 bg-[#EDEAE2] dark:bg-[#202126]/60 border-b border-[#C5C7CB]/50 dark:border-white/10">
                <p className="text-xs text-[#3F3F46] dark:text-[#C5C7CB] mb-2">
                  {remainingForFree === 0 ? (
                    <span className="font-semibold text-[#101114] dark:text-[#D7FF45]">
                      You qualify for complimentary nationwide express delivery.
                    </span>
                  ) : (
                    <>
                      Add{' '}
                      <span className="font-mono font-semibold text-[#101114] dark:text-[#F5F3ED]">
                        {formatPKR(remainingForFree)}
                      </span>{' '}
                      more for complimentary delivery.
                    </>
                  )}
                </p>
                <div className="h-1 bg-[#C5C7CB]/40 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#101114] dark:bg-[#D7FF45] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag
                    className="w-10 h-10 text-[#C5C7CB] dark:text-white/30 mb-4"
                    strokeWidth={1.25}
                  />
                  <p className="font-editorial text-xl mb-2">Your bag is empty</p>
                  <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] max-w-xs mb-6">
                    Explore our curated collection of architectural court sneakers and performance
                    runners.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em] hover:opacity-90"
                  >
                    Explore Sneakers
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => {
                  const unitPrice = getEffectivePrice(item.product);
                  return (
                    <div
                      key={item.variant_id}
                      className="flex gap-4 pb-4 border-b border-[#C5C7CB]/50 dark:border-white/10 last:border-b-0"
                    >
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="w-24 h-20 bg-[#EDEAE2] dark:bg-[#202126] border border-[#C5C7CB]/50 dark:border-white/10 shrink-0 overflow-hidden"
                      >
                        <SafeImage
                          src={getPrimaryImage(item.product)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold hover:opacity-75 truncate"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variant_id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-[#71717A] dark:text-[#C5C7CB] hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-0.5">
                          EU {item.variant.size_eu} · {item.variant.color_name}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center border border-[#C5C7CB]/60 dark:border-white/15 bg-white dark:bg-[#202126]">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.variant_id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#EDEAE2] dark:hover:bg-white/10"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-mono tabular-nums text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.variant_id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#EDEAE2] dark:hover:bg-white/10"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono tabular-nums text-sm font-semibold">
                            {formatPKR(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white dark:bg-[#202126] border-t border-[#C5C7CB]/60 dark:border-white/10 space-y-4">
                <div className="space-y-1.5 text-sm">
                  {savingsPkr > 0 && (
                    <div className="flex items-center justify-between text-[#101114] dark:text-[#D7FF45]">
                      <span>Collection Savings</span>
                      <span className="font-mono tabular-nums">- {formatPKR(savingsPkr)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatPKR(subtotalPkr)}</span>
                  </div>
                  <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                    Cash on Delivery (COD) · Shipping calculated at checkout.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="py-3 px-4 border border-[#101114] dark:border-white/25 text-center text-xs font-semibold uppercase tracking-[0.12em] hover:bg-[#EDEAE2] dark:hover:bg-white/10 transition-colors"
                  >
                    View Bag
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="py-3 px-4 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-center text-xs font-bold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-1.5"
                  >
                    Checkout
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
