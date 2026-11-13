import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Lock, ShieldCheck, Tag, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { SupabaseNoticeBanner } from '../components/common/SupabaseNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchAddresses } from '../services/accountService';
import { placeCodOrder, validateCouponCode } from '../services/orderService';
import { formatPKR, getEffectivePrice, getPrimaryImage } from '../utils/format';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { cartItems, subtotalPkr, siteSettings, clearCart, refreshCatalog, showToast } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPkr: number } | null>(
    null
  );
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName((prev) => prev || profile.full_name || '');
      setEmail((prev) => prev || profile.email || user?.email || '');
      setPhone((prev) => prev || profile.phone || '');
    } else if (user?.email) {
      setEmail((prev) => prev || user.email || '');
    }
  }, [profile, user]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    fetchAddresses(user.id)
      .then((list) => {
        const def = list.find((a) => a.is_default) ?? list[0];
        if (def) {
          setFullName((prev) => prev || def.full_name);
          setPhone((prev) => prev || def.phone);
          setAddress((prev) => prev || def.street_address);
          setCity((prev) => prev || def.city);
          setPostalCode((prev) => prev || def.postal_code);
        }
      })
      .catch(() => {});
  }, [user]);

  const discountPkr = appliedCoupon?.discountPkr ?? 0;
  const discountedSubtotal = Math.max(0, subtotalPkr - discountPkr);
  const deliveryFeePkr =
    discountedSubtotal >= siteSettings.shipping.free_threshold_pkr
      ? 0
      : siteSettings.shipping.flat_rate_pkr;
  const totalPkr = discountedSubtotal + deliveryFeePkr;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    if (!isSupabaseConfigured) {
      setCouponMessage('Configure Supabase credentials to validate promo codes.');
      return;
    }
    setApplyingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await validateCouponCode(code, subtotalPkr);
      if (res.valid && res.code) {
        setAppliedCoupon({
          code: res.code,
          discountPkr: Number(res.discount_pkr ?? 0),
        });
        setCouponMessage(`Code ${res.code} applied (-${formatPKR(res.discount_pkr ?? 0)}).`);
      } else {
        setAppliedCoupon(null);
        setCouponMessage(res.message ?? 'Promo code is invalid.');
      }
    } catch (err) {
      setCouponMessage(err instanceof Error ? err.message : 'Unable to validate coupon.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (cartItems.length === 0) {
      setSubmitError('Your shopping bag is empty.');
      return;
    }

    if (!isSupabaseConfigured) {
      setSubmitError(
        'Cannot place order: Supabase database is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY so orders persist securely in PostgreSQL.'
      );
      return;
    }

    if (fullName.trim().length < 2) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setSubmitError('Please enter a valid contact phone number.');
      return;
    }
    if (address.trim().length < 5) {
      setSubmitError('Please provide your complete street delivery address.');
      return;
    }
    if (city.trim().length < 2) {
      setSubmitError('Please enter your delivery city.');
      return;
    }
    if (postalCode.trim().length < 3) {
      setSubmitError('Please enter your postal code.');
      return;
    }

    setSubmitting(true);
    try {
      const createdOrder = await placeCodOrder({
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        shippingAddress: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        orderNotes: orderNotes.trim(),
        couponCode: appliedCoupon?.code ?? null,
        items: cartItems.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      });

      await clearCart();
      await refreshCatalog();
      showToast(`Order ${createdOrder.order_number} confirmed!`, 'success');
      navigate(`/order-confirmation/${createdOrder.order_number}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to complete order placement. Please verify stock and Supabase configuration.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]';

  return (
    <>
      <SeoHead
        title="Checkout — Cash on Delivery"
        description="Complete your SOLEVERSE sneaker order."
        canonicalPath="/checkout"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
            Secure Checkout
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold">
            Delivery & Cash on Delivery
          </h1>
        </div>

        <SupabaseNoticeBanner context="checkout" />

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-12 text-center">
            <h2 className="font-editorial text-2xl font-semibold mb-2">Your bag is empty</h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mb-6">
              Add sneakers to your bag before proceeding to checkout.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
            >
              Browse Sneakers
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Left: Delivery & COD Form */}
            <div className="lg:col-span-7 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 sm:p-8 space-y-6">
              <h2 className="font-editorial text-xl font-semibold pb-4 border-b border-[#EDEAE2] dark:border-white/10">
                Recipient & Delivery Details
              </h2>

              {submitError && (
                <div
                  role="alert"
                  className="bg-red-50 dark:bg-red-950/50 border border-red-400/50 text-red-900 dark:text-red-200 p-4 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Hamza Qureshi"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className={inputCls}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Complete Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Apartment, Street, Sector / Phase"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore / Karachi / Islamabad"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="54000"
                    className={`${inputCls} font-mono`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Courier gate instructions or preferred delivery window..."
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-4 border-t border-[#EDEAE2] dark:border-white/10">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-3">
                  Payment Method
                </h3>
                <div className="border border-[#101114] dark:border-[#D7FF45] bg-[#F5F3ED] dark:bg-[#101114] p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#D7FF45] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Cash on Delivery (COD)</p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1 leading-relaxed">
                      Pay in cash directly to the courier upon doorstep arrival. Includes 14-day
                      unworn size exchange protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <aside className="lg:col-span-5 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 sm:p-8 space-y-5">
              <h2 className="font-editorial text-xl font-semibold pb-4 border-b border-[#EDEAE2] dark:border-white/10">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const unitPrice = getEffectivePrice(item.product);
                  return (
                    <div key={item.variant_id} className="flex gap-3.5 items-center">
                      <SafeImage
                        src={getPrimaryImage(item.product)}
                        alt={item.product.name}
                        className="w-16 h-14 object-cover bg-[#EDEAE2] dark:bg-[#101114] border border-[#C5C7CB]/50 dark:border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.product.name}</p>
                        <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                          EU {item.variant.size_eu} · {item.variant.color_name} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums text-xs font-semibold">
                        {formatPKR(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Input */}
              <div className="pt-4 border-t border-[#EDEAE2] dark:border-white/10">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. SOLE10"
                      className="w-full pl-8 pr-3 py-2 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-xs font-mono uppercase focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={applyingCoupon}
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 border border-[#101114] dark:border-[#D7FF45] text-xs font-semibold uppercase tracking-wider hover:bg-[#101114] hover:text-white dark:hover:bg-[#D7FF45] dark:hover:text-[#101114] transition-colors"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-xs mt-1.5 ${
                      appliedCoupon
                        ? 'text-emerald-600 dark:text-[#D7FF45]'
                        : 'text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-[#EDEAE2] dark:border-white/10 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#52525B] dark:text-[#C5C7CB]">Subtotal</span>
                  <span className="font-mono tabular-nums">{formatPKR(subtotalPkr)}</span>
                </div>
                {discountPkr > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-[#D7FF45]">
                    <span>Promo Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums">- {formatPKR(discountPkr)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#52525B] dark:text-[#C5C7CB]">Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFeePkr === 0 ? 'Complimentary' : formatPKR(deliveryFeePkr)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#EDEAE2] dark:border-white/10 text-base font-semibold">
                  <span>Total Payable on Delivery</span>
                  <span className="font-mono tabular-nums">{formatPKR(totalPkr)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] hover:opacity-90 disabled:opacity-50 text-xs font-bold uppercase tracking-[0.18em] transition-opacity flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                {submitting ? 'Confirming Order in Database...' : 'Place Order (COD)'}
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#52525B] dark:text-[#C5C7CB] pt-1">
                <span className="inline-flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> {siteSettings.shipping.estimated_days}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Stock
                </span>
              </div>
            </aside>
          </form>
        )}
      </div>
    </>
  );
}
