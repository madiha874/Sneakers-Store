import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SafeImage } from '../../components/common/SafeImage';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import { adminFetchAllProducts, adminUpdateVariantStock } from '../../services/adminService';
import { Product } from '../../types';
import { getPrimaryImage } from '../../utils/format';

export function AdminInventoryPage() {
  const { refreshCatalog, showToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await adminFetchAllProducts());
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to load inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStockUpdate = async (variantId: string, nextQty: number) => {
    const clean = Math.max(0, nextQty);
    try {
      await adminUpdateVariantStock(variantId, clean);
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, stock_quantity: clean } : v
          ),
        }))
      );
      await refreshCatalog();
      showToast('Warehouse stock updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    }
  };

  const rows = products.flatMap((p) =>
    p.variants
      .filter((v) => {
        if (lowStockOnly && v.stock_quantity > 5) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          v.sku_variant.toLowerCase().includes(q) ||
          v.size_eu.toLowerCase().includes(q) ||
          v.color_name.toLowerCase().includes(q)
        );
      })
      .map((v) => ({ product: p, variant: v }))
  );

  const lowCount = products.reduce(
    (sum, p) => sum + p.variants.filter((v) => v.stock_quantity <= 5).length,
    0
  );
  const outCount = products.reduce(
    (sum, p) => sum + p.variants.filter((v) => v.stock_quantity === 0).length,
    0
  );

  return (
    <>
      <SeoHead title="Inventory Matrix · Admin" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Warehouse Ledger
            </p>
            <h1 className="font-editorial text-3xl font-semibold">Inventory Control</h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
              Real-time stock allocation across EU sizes and sneaker colorways.
            </p>
          </div>

          <div className="flex gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10">
              Low Stock (≤5): <strong>{lowCount}</strong>
            </span>
            <span className="px-3 py-1.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 text-[#DC2626]">
              Out of Stock: <strong>{outCount}</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sneaker, variant SKU, EU size, or colorway..."
            className="flex-1 min-w-[240px] max-w-md px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-sm"
          />
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
            />
            Low Stock Only (≤ 5)
          </label>
        </div>

        <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
              <tr>
                <th className="py-3 px-4">Sneaker</th>
                <th className="py-3 px-4">Variant SKU</th>
                <th className="py-3 px-4">EU Size</th>
                <th className="py-3 px-4">Colorway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Stock Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#52525B] dark:text-[#C5C7CB]">
                    Loading warehouse variants...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#52525B] dark:text-[#C5C7CB]">
                    No inventory rows match your current filter.
                  </td>
                </tr>
              ) : (
                rows.map(({ product, variant }) => {
                  const isOut = variant.stock_quantity === 0;
                  const isLow = variant.stock_quantity > 0 && variant.stock_quantity <= 5;
                  return (
                    <tr
                      key={variant.id}
                      className="hover:bg-[#F5F3ED]/60 dark:hover:bg-[#101114]/40"
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <SafeImage
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            className="w-12 h-9 object-cover bg-[#EAE6DC] dark:bg-[#101114] shrink-0"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-[#52525B] dark:text-[#C5C7CB]">
                        {variant.sku_variant}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold">EU {variant.size_eu}</td>
                      <td className="py-2.5 px-4 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: variant.color_hex }}
                          />
                          {variant.color_name}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 text-[#DC2626] font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Sold Out
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#16A34A] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <input
                          type="number"
                          min={0}
                          defaultValue={variant.stock_quantity}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (!Number.isNaN(val) && val !== variant.stock_quantity) {
                              handleStockUpdate(variant.id, val);
                            }
                          }}
                          className="w-20 px-2.5 py-1 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-right font-mono text-xs"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
