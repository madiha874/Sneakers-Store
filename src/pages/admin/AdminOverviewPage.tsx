import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import {
  adminDeleteCoupon,
  adminFetchAllProducts,
  adminFetchCoupons,
  adminFetchCustomers,
  adminFetchReviews,
  adminSaveCoupon,
  adminSaveSiteSettings,
  adminToggleReviewApproval,
  adminUpdateVariantStock,
  AdminOverviewStats,
  fetchAdminOverview,
} from '../../services/adminService';
import { Coupon, Product, Profile, Review, SiteSettings } from '../../types';
import { formatDate, formatPKR } from '../../utils/format';

type OpsTab = 'overview' | 'inventory' | 'customers' | 'reviews' | 'discounts' | 'settings';

function AnimatedCounter({
  value,
  formatter,
}: {
  value: number;
  formatter?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const duration = 650;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return <>{formatter ? formatter(display) : display.toLocaleString('en-PK')}</>;
}

export function AdminOverviewPage() {
  const { siteSettings, refreshCatalog, showToast } = useStore();

  const [tab, setTab] = useState<OpsTab>('overview');
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New coupon state
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newVal, setNewVal] = useState('10');
  const [newMin, setNewMin] = useState('15000');

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, prods, custs, revs, cps] = await Promise.all([
        fetchAdminOverview(),
        adminFetchAllProducts(),
        adminFetchCustomers(),
        adminFetchReviews(),
        adminFetchCoupons(),
      ]);
      setStats(ov);
      setProducts(prods);
      setCustomers(custs);
      setReviews(revs);
      setCoupons(cps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  const handleStockAdjust = async (variantId: string, nextStock: number) => {
    try {
      await adminUpdateVariantStock(variantId, nextStock);
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, stock_quantity: Math.max(0, nextStock) } : v
          ),
        }))
      );
      showToast('Variant stock updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Stock update failed.', 'error');
    }
  };

  const handleToggleReview = async (rev: Review) => {
    try {
      await adminToggleReviewApproval(rev.id, !rev.is_approved);
      setReviews((prev) =>
        prev.map((r) => (r.id === rev.id ? { ...r, is_approved: !rev.is_approved } : r))
      );
      showToast(`Review ${!rev.is_approved ? 'approved' : 'hidden'}.`, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Review update failed.', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    try {
      const created = await adminSaveCoupon({
        code: newCode.trim().toUpperCase(),
        description: newDesc.trim(),
        discount_type: newType,
        discount_value: Number(newVal),
        min_order_pkr: Number(newMin),
        max_uses: 500,
        expires_at: null,
        is_active: true,
      });
      setCoupons((prev) => [created, ...prev]);
      setNewCode('');
      setNewDesc('');
      showToast(`Promo code ${created.code} created.`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save coupon.', 'error');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await adminDeleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast('Coupon removed.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete coupon.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminSaveSiteSettings(settingsForm);
      await refreshCatalog();
      showToast('Website settings saved.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save settings.', 'error');
    }
  };

  const maxRevenue = Math.max(1, ...(stats?.monthlyRevenue.map((m) => m.revenue) ?? [1]));
  const inputCls =
    'w-full px-3.5 py-2.5 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED]';

  return (
    <>
      <SeoHead title="Admin Dashboard" />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Store Operations
            </p>
            <h1 className="font-editorial text-3xl font-semibold">Executive Dashboard</h1>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-[#E5E2DA]/70 dark:bg-[#202126] p-1 border border-[#E5E2DA] dark:border-white/10">
            {(
              [
                { key: 'overview', label: 'Overview' },
                { key: 'inventory', label: 'Quick Inventory' },
                { key: 'customers', label: 'Customers' },
                { key: 'reviews', label: 'Reviews' },
                { key: 'discounts', label: 'Discounts' },
                { key: 'settings', label: 'Settings' },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  tab === t.key
                    ? 'bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                    : 'text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-[#FEE2E2] dark:bg-red-950/50 border border-[#DC2626]/40 text-[#991B1B] dark:text-red-200 p-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 bg-[#E5E2DA] dark:bg-[#202126] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                {/* KPI Cards with Animated Counters */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-5">
                    <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                      Total Revenue
                    </p>
                    <p className="font-mono tabular-nums text-2xl font-semibold mt-2">
                      <AnimatedCounter value={stats.totalRevenuePkr} formatter={formatPKR} />
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-5">
                    <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                      Total Orders
                    </p>
                    <p className="font-mono tabular-nums text-2xl font-semibold mt-2">
                      <AnimatedCounter value={stats.totalOrders} />
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-[#D7FF45] mt-1 font-mono">
                      {stats.pendingOrders} Pending COD
                    </p>
                  </div>

                  <Link
                    to="/admin/inventory"
                    className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-5 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors"
                  >
                    <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                      Total Products
                    </p>
                    <p className="font-mono tabular-nums text-2xl font-semibold mt-2">
                      <AnimatedCounter value={stats.totalProducts} />
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1 font-mono">
                      {stats.lowStockVariantsCount} Low-Stock Variants →
                    </p>
                  </Link>

                  <Link
                    to="/admin/customers"
                    className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-5 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors"
                  >
                    <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                      Registered Customers
                    </p>
                    <p className="font-mono tabular-nums text-2xl font-semibold mt-2">
                      <AnimatedCounter value={stats.totalCustomers} />
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1 font-mono">
                      View Directory →
                    </p>
                  </Link>
                </div>

                {/* Sales Overview */}
                <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-editorial text-xl font-semibold">Sales Overview</h2>
                    <span className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                      Confirmed COD Revenue (PKR)
                    </span>
                  </div>
                  {stats.monthlyRevenue.length === 0 ? (
                    <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] py-6">
                      No confirmed orders recorded yet. Revenue bars appear automatically as COD
                      orders are placed.
                    </p>
                  ) : (
                    <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4">
                      {stats.monthlyRevenue.map((day) => {
                        const heightPct = Math.max(8, Math.round((day.revenue / maxRevenue) * 100));
                        return (
                          <div
                            key={day.label}
                            className="flex flex-col items-center gap-2 h-full justify-end"
                          >
                            <span className="font-mono text-[10px] text-[#52525B] dark:text-[#C5C7CB] tabular-nums">
                              {formatPKR(day.revenue).replace('PKR ', '')}
                            </span>
                            <div
                              className="w-full max-w-[44px] bg-[#101114] dark:bg-[#D7FF45] hover:opacity-80 transition-opacity"
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className="text-[11px] text-[#52525B] dark:text-[#C5C7CB]">
                              {day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
                  <div className="p-6 border-b border-[#E5E2DA] dark:border-white/10 flex items-center justify-between">
                    <h2 className="font-editorial text-xl font-semibold">Recent Orders</h2>
                    <Link
                      to="/admin/orders"
                      className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 bg-[#D7FF45] text-[#101114] hover:opacity-90"
                    >
                      Manage All Orders
                    </Link>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">City</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
                      {stats.recentOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-[#52525B] dark:text-[#C5C7CB]"
                          >
                            No orders placed yet.
                          </td>
                        </tr>
                      ) : (
                        stats.recentOrders.map((o) => (
                          <tr
                            key={o.id}
                            className="hover:bg-[#F5F3ED]/60 dark:hover:bg-[#101114]/40"
                          >
                            <td className="py-3 px-4 font-mono font-semibold">{o.order_number}</td>
                            <td className="py-3 px-4">{o.customer_name}</td>
                            <td className="py-3 px-4 text-[#52525B] dark:text-[#C5C7CB]">
                              {o.city}
                            </td>
                            <td className="py-3 px-4">{o.status}</td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                              {formatPKR(o.total_pkr)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUICK INVENTORY */}
            {tab === 'inventory' && (
              <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
                <div className="p-6 border-b border-[#E5E2DA] dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-editorial text-xl font-semibold">
                      Variant Inventory Ledger
                    </h2>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1">
                      Update stock quantities per EU size & colorway directly in PostgreSQL.
                    </p>
                  </div>
                  <Link
                    to="/admin/inventory"
                    className="px-4 py-2 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
                  >
                    Full Inventory Matrix
                  </Link>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    <tr>
                      <th className="py-3 px-4">Sneaker</th>
                      <th className="py-3 px-4">Variant SKU</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Color</th>
                      <th className="py-3 px-4 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
                    {products.flatMap((p) =>
                      p.variants.map((v) => (
                        <tr key={v.id} className="hover:bg-[#F5F3ED]/60 dark:hover:bg-[#101114]/40">
                          <td className="py-2.5 px-4 font-medium">{p.name}</td>
                          <td className="py-2.5 px-4 font-mono text-xs text-[#52525B] dark:text-[#C5C7CB]">
                            {v.sku_variant}
                          </td>
                          <td className="py-2.5 px-4 font-mono">EU {v.size_eu}</td>
                          <td className="py-2.5 px-4 text-xs">{v.color_name}</td>
                          <td className="py-2.5 px-4 text-right">
                            <input
                              type="number"
                              min={0}
                              defaultValue={v.stock_quantity}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (!Number.isNaN(val) && val !== v.stock_quantity) {
                                  handleStockAdjust(v.id, val);
                                }
                              }}
                              className="w-20 px-2 py-1 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-right font-mono text-xs"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* CUSTOMERS DIRECTORY */}
            {tab === 'customers' && (
              <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
                <div className="p-6 border-b border-[#E5E2DA] dark:border-white/10 flex items-center justify-between">
                  <h2 className="font-editorial text-xl font-semibold">Registered Accounts</h2>
                  <Link
                    to="/admin/customers"
                    className="px-4 py-2 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
                  >
                    Open Full Directory
                  </Link>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-medium">{c.full_name || '—'}</td>
                        <td className="py-3 px-4 text-[#52525B] dark:text-[#C5C7CB]">{c.email}</td>
                        <td className="py-3 px-4 font-mono text-xs">{c.phone || '—'}</td>
                        <td className="py-3 px-4 capitalize font-mono text-xs">{c.role}</td>
                        <td className="py-3 px-4 text-xs text-[#52525B] dark:text-[#C5C7CB]">
                          {formatDate(c.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* REVIEWS MODERATION */}
            {tab === 'reviews' && (
              <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 divide-y divide-[#E5E2DA] dark:divide-white/10">
                <div className="p-6">
                  <h2 className="font-editorial text-xl font-semibold">Reviews Moderation</h2>
                </div>
                {reviews.length === 0 ? (
                  <p className="p-6 text-sm text-[#52525B] dark:text-[#C5C7CB]">
                    No customer reviews submitted yet.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {rev.author_name} · {rev.rating}★
                        </p>
                        <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">{rev.title}</p>
                        <p className="text-sm text-[#202126] dark:text-[#F5F3ED] mt-1">
                          {rev.comment}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleReview(rev)}
                        className={`px-3 py-1.5 text-xs font-semibold border ${
                          rev.is_approved
                            ? 'border-[#16A34A] text-[#16A34A]'
                            : 'border-[#DC2626] text-[#DC2626]'
                        }`}
                      >
                        {rev.is_approved ? 'Approved' : 'Hidden'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* DISCOUNTS / COUPONS */}
            {tab === 'discounts' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form
                  onSubmit={handleCreateCoupon}
                  className="lg:col-span-5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-6 space-y-4"
                >
                  <h2 className="font-editorial text-xl font-semibold">Create Promo Code</h2>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="CODE (e.g. WINTER15)"
                    className={`${inputCls} font-mono uppercase`}
                  />
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Description"
                    className={inputCls}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'percentage' | 'fixed')}
                      className={inputCls}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed PKR</option>
                    </select>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                      placeholder="Value"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={newMin}
                    onChange={(e) => setNewMin(e.target.value)}
                    placeholder="Minimum Order (PKR)"
                    className={`${inputCls} font-mono`}
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
                  >
                    Create Coupon
                  </button>
                </form>

                <div className="lg:col-span-7 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 divide-y divide-[#E5E2DA] dark:divide-white/10">
                  <div className="p-5 font-editorial text-lg font-semibold">Active Coupons</div>
                  {coupons.map((c) => (
                    <div key={c.id} className="p-4 flex items-center justify-between gap-4 text-sm">
                      <div>
                        <p className="font-mono font-semibold">{c.code}</p>
                        <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                          {c.discount_type === 'percentage'
                            ? `${c.discount_value}% off`
                            : `${formatPKR(c.discount_value)} off`}{' '}
                          · Min {formatPKR(c.min_order_pkr)} · Used {c.used_count}x
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-xs text-[#DC2626] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WEBSITE SETTINGS (with editable Gmail & WhatsApp fields) */}
            {tab === 'settings' && (
              <form
                onSubmit={handleSaveSettings}
                className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-6 sm:p-8 max-w-2xl space-y-5"
              >
                <h2 className="font-editorial text-xl font-semibold">
                  Website, Shipping & Concierge Settings
                </h2>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                    Announcement Bar Copy
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement.text}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, text: e.target.value },
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                      Flat COD Delivery Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.shipping.flat_rate_pkr}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          shipping: {
                            ...settingsForm.shipping,
                            flat_rate_pkr: Number(e.target.value),
                          },
                        })
                      }
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                      Free Shipping Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.shipping.free_threshold_pkr}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          shipping: {
                            ...settingsForm.shipping,
                            free_threshold_pkr: Number(e.target.value),
                          },
                        })
                      }
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                      Support Email (Gmail)
                    </label>
                    <input
                      type="email"
                      value={settingsForm.store.support_email}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          store: { ...settingsForm.store, support_email: e.target.value },
                        })
                      }
                      placeholder="your-store@gmail.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                      WhatsApp Business Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.store.whatsapp_number}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          store: { ...settingsForm.store, whatsapp_number: e.target.value },
                        })
                      }
                      placeholder="+923000000000"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.store.support_phone}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          store: { ...settingsForm.store, support_phone: e.target.value },
                        })
                      }
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settingsForm.store.instagram_url}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          store: { ...settingsForm.store, instagram_url: e.target.value },
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider hover:opacity-90"
                >
                  Save Settings
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}
