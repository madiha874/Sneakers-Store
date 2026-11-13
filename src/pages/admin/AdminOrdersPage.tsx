import { useEffect, useState } from 'react';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import { adminFetchOrders, adminUpdateOrderStatus } from '../../services/adminService';
import { Order, OrderStatus } from '../../types';
import { formatDate, formatPKR } from '../../utils/format';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export function AdminOrdersPage() {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchOrders();
      setOrders(data);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: nextStatus });
      }
      showToast(`Order status updated to ${nextStatus}.`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Status update failed.', 'error');
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <SeoHead title="Admin Orders" />

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
            Dispatch & Fulfillment
          </p>
          <h1 className="font-editorial text-3xl font-semibold">
            Orders Management ({orders.length})
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
            Inspect Cash on Delivery shipments, customer addresses, and fulfillments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, customer, phone, or city..."
            className="flex-1 max-w-md px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-sm"
          >
            <option value="ALL">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-7 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-[#52525B] dark:text-[#C5C7CB]"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-[#52525B] dark:text-[#C5C7CB]"
                    >
                      No orders match your filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className={`cursor-pointer hover:bg-[#F5F3ED]/70 dark:hover:bg-[#101114]/50 ${
                        selectedOrder?.id === o.id ? 'bg-[#F5F3ED] dark:bg-[#101114]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <p className="font-mono font-semibold">{o.order_number}</p>
                        <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                          {formatDate(o.created_at)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{o.customer_name}</p>
                        <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">{o.city}</p>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 border border-[#E5E2DA] dark:border-white/15 bg-white dark:bg-[#101114] text-xs font-medium"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                        {formatPKR(o.total_pkr)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Order Detail Inspector */}
          <aside className="xl:col-span-5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-6 space-y-5">
            {!selectedOrder ? (
              <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] py-12 text-center">
                Select any order row to inspect delivery details and purchased pairs.
              </p>
            ) : (
              <>
                <div className="pb-4 border-b border-[#E5E2DA] dark:border-white/10 flex justify-between items-start">
                  <div>
                    <p className="font-mono text-lg font-semibold">{selectedOrder.order_number}</p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                      {selectedOrder.payment_method} · {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-[#D7FF45] text-[#101114]">
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                    Recipient
                  </p>
                  <p className="font-semibold">{selectedOrder.customer_name}</p>
                  <p className="text-[#52525B] dark:text-[#C5C7CB]">
                    {selectedOrder.customer_email}
                  </p>
                  <p className="font-mono text-xs">{selectedOrder.customer_phone}</p>
                  <p className="pt-1 text-[#202126] dark:text-[#F5F3ED]">
                    {selectedOrder.shipping_address}, {selectedOrder.city}{' '}
                    {selectedOrder.postal_code}
                  </p>
                  {selectedOrder.order_notes && (
                    <p className="text-xs italic text-[#52525B] dark:text-[#C5C7CB] pt-1">
                      Note: {selectedOrder.order_notes}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E5E2DA] dark:border-white/10">
                  <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                    Order Items
                  </p>
                  {(selectedOrder.items ?? []).map((item, idx) => (
                    <div key={item.id ?? idx} className="flex justify-between text-xs py-1.5">
                      <span>
                        {item.product_name} (EU {item.size_eu} · {item.color_name}) ×{' '}
                        {item.quantity}
                      </span>
                      <span className="font-mono font-semibold">
                        {formatPKR(item.line_total_pkr)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#E5E2DA] dark:border-white/10 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#52525B] dark:text-[#C5C7CB]">Subtotal</span>
                    <span className="font-mono">{formatPKR(selectedOrder.subtotal_pkr)}</span>
                  </div>
                  {selectedOrder.discount_pkr > 0 && (
                    <div className="flex justify-between text-[#16A34A]">
                      <span>Discount</span>
                      <span className="font-mono">- {formatPKR(selectedOrder.discount_pkr)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#52525B] dark:text-[#C5C7CB]">Delivery</span>
                    <span className="font-mono">{formatPKR(selectedOrder.delivery_fee_pkr)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-[#E5E2DA] dark:border-white/10">
                    <span>Total COD</span>
                    <span className="font-mono">{formatPKR(selectedOrder.total_pkr)}</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
