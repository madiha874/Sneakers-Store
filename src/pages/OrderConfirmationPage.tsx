import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchOrderByNumber } from '../services/orderService';
import { Order } from '../types';
import { formatDate, formatPKR } from '../utils/format';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const stateOrder = (location.state as { order?: Order } | null)?.order ?? null;

  const [order, setOrder] = useState<Order | null>(stateOrder);
  const [loading, setLoading] = useState(!stateOrder && isSupabaseConfigured);

  useEffect(() => {
    if (stateOrder || !orderNumber || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetchOrderByNumber(orderNumber)
      .then((res) => setOrder(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderNumber, stateOrder]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-[#52525B] dark:text-[#C5C7CB]">
        Retrieving confirmed order receipt...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <SeoHead title="Order Receipt Unavailable" />
        <h1 className="font-editorial text-3xl font-semibold">Order Receipt Not Found</h1>
        <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
          No confirmed database record was found for reference{' '}
          <span className="font-mono font-semibold">{orderNumber}</span>. Sign in to view your
          personal order history.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/account/orders"
            className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
          >
            My Orders
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 border border-[#101114] dark:border-white/25 text-xs font-semibold uppercase tracking-[0.14em]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead title={`Order ${order.order_number} Confirmed`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDEAE2] dark:border-white/10">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-[#D7FF45] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 dark:text-[#D7FF45] font-semibold">
                  Order Confirmed — {order.status}
                </p>
                <h1 className="font-editorial text-2xl sm:text-3xl font-semibold mt-1">
                  Thank you, {order.customer_name}
                </h1>
                <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mt-1">
                  Your order has been persisted and stock reserved for Cash on Delivery dispatch.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                Order Reference
              </p>
              <p className="font-mono text-lg font-semibold">{order.order_number}</p>
              <p className="text-xs text-[#71717A] dark:text-[#C5C7CB]/70">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/50 dark:border-white/10 p-4 space-y-1">
              <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2">
                Shipping Destination
              </p>
              <p className="font-semibold">{order.customer_name}</p>
              <p className="text-[#3F3F46] dark:text-[#C5C7CB]">{order.shipping_address}</p>
              <p className="text-[#3F3F46] dark:text-[#C5C7CB]">
                {order.city} {order.postal_code}
              </p>
              <p className="font-mono text-xs text-[#52525B] dark:text-[#C5C7CB] pt-1">
                {order.customer_phone}
              </p>
            </div>

            <div className="bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/50 dark:border-white/10 p-4 space-y-1">
              <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2">
                Payment & Fulfillment
              </p>
              <p className="font-semibold">{order.payment_method}</p>
              <p className="text-[#3F3F46] dark:text-[#C5C7CB]">
                Amount Due on Arrival:{' '}
                <span className="font-mono font-semibold text-[#101114] dark:text-[#D7FF45]">
                  {formatPKR(order.total_pkr)}
                </span>
              </p>
              <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] pt-1 inline-flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#101114] dark:text-[#D7FF45]" />
                12-Point Atelier Verification Prior to Dispatch
              </p>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                Reserved Pairs
              </h2>
              <div className="divide-y divide-[#EDEAE2] dark:divide-white/10 border border-[#C5C7CB]/50 dark:border-white/10">
                {order.items.map((item, idx) => (
                  <div key={item.id ?? idx} className="p-4 flex items-center gap-4">
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
                    <span className="font-mono tabular-nums text-sm font-semibold">
                      {formatPKR(item.line_total_pkr)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#EDEAE2] dark:border-white/10 max-w-xs ml-auto space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#52525B] dark:text-[#C5C7CB]">Subtotal</span>
              <span className="font-mono tabular-nums">{formatPKR(order.subtotal_pkr)}</span>
            </div>
            {order.discount_pkr > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-[#D7FF45]">
                <span>Discount</span>
                <span className="font-mono tabular-nums">- {formatPKR(order.discount_pkr)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#52525B] dark:text-[#C5C7CB]">Delivery Fee</span>
              <span className="font-mono tabular-nums">
                {order.delivery_fee_pkr === 0 ? 'Complimentary' : formatPKR(order.delivery_fee_pkr)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#EDEAE2] dark:border-white/10 font-semibold text-base">
              <span>Total (COD)</span>
              <span className="font-mono tabular-nums">{formatPKR(order.total_pkr)}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#EDEAE2] dark:border-white/10">
            <Link
              to="/account/orders"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] hover:underline"
            >
              Track Order in My Account
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 hover:opacity-90"
            >
              Continue Shopping
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
