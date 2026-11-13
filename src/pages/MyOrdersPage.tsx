import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchMyOrders } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { formatDate, formatPKR } from '../utils/format';

const TRACKING_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetchMyOrders(user.id)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load orders.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-sm text-[#52525B] dark:text-[#C5C7CB]">
        Loading orders...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/account/orders' }} replace />;
  }

  return (
    <>
      <SeoHead
        title="My Orders"
        description="Track your SOLEVERSE Cash on Delivery orders."
        canonicalPath="/account/orders"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Order History
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold">My Orders</h1>
          </div>
          <Link
            to="/account"
            className="text-xs font-semibold uppercase tracking-wider underline dark:text-[#D7FF45]"
          >
            Back to Account
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-400/50 text-red-900 dark:text-red-200 p-4 text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 bg-[#EDEAE2] dark:bg-[#202126] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-12 text-center">
            <Package
              className="w-10 h-10 text-[#C5C7CB] dark:text-white/30 mx-auto mb-3"
              strokeWidth={1.25}
            />
            <h2 className="font-editorial text-2xl font-semibold mb-2">No orders placed yet</h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mb-6">
              When you place a Cash on Delivery order while signed in, real-time tracking appears
              here.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
            >
              Browse Sneakers
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIdx = TRACKING_STEPS.indexOf(order.status);
              return (
                <article
                  key={order.id}
                  className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDEAE2] dark:border-white/10">
                    <div>
                      <p className="font-mono text-base font-semibold">{order.order_number}</p>
                      <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-0.5">
                        Placed {formatDate(order.created_at)} · {order.payment_method}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 ${
                          order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200'
                            : order.status === 'Delivered'
                              ? 'bg-[#D7FF45] text-[#101114]'
                              : 'bg-[#EDEAE2] dark:bg-white/10 text-[#101114] dark:text-[#F5F3ED]'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-mono tabular-nums text-base font-semibold">
                        {formatPKR(order.total_pkr)}
                      </span>
                    </div>
                  </div>

                  {order.status !== 'Cancelled' && (
                    <div className="grid grid-cols-5 gap-2 py-2">
                      {TRACKING_STEPS.map((step, idx) => {
                        const completed = idx <= currentStepIdx;
                        return (
                          <div key={step} className="space-y-1.5">
                            <div
                              className={`h-1.5 ${
                                completed
                                  ? 'bg-[#101114] dark:bg-[#D7FF45]'
                                  : 'bg-[#EDEAE2] dark:bg-white/10'
                              }`}
                            />
                            <p
                              className={`text-[11px] font-medium ${
                                completed
                                  ? 'text-[#101114] dark:text-[#F5F3ED]'
                                  : 'text-[#A1A1AA] dark:text-[#C5C7CB]/40'
                              }`}
                            >
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {order.items && order.items.length > 0 && (
                    <div className="divide-y divide-[#EDEAE2] dark:divide-white/10">
                      {order.items.map((item, idx) => (
                        <div key={item.id ?? idx} className="py-3 flex items-center gap-4">
                          <SafeImage
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-16 h-12 object-cover bg-[#EDEAE2] dark:bg-[#101114] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{item.product_name}</p>
                            <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                              EU {item.size_eu} · {item.color_name} · Qty {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono tabular-nums text-sm font-medium">
                            {formatPKR(item.line_total_pkr)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-[#52525B] dark:text-[#C5C7CB] pt-2 border-t border-[#EDEAE2] dark:border-white/10 flex flex-wrap justify-between gap-2">
                    <span>
                      Deliver to: {order.shipping_address}, {order.city} {order.postal_code}
                    </span>
                    <span className="font-mono">{order.customer_phone}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
