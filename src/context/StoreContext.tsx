import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_SITE_SETTINGS } from '../data/catalogSeed';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  addToWishlistDb,
  clearCartDb,
  fetchCartDb,
  fetchWishlistDb,
  removeCartItemDb,
  removeFromWishlistDb,
  upsertCartItemDb,
} from '../services/accountService';
import {
  fetchAllProducts,
  fetchBrands,
  fetchCategories,
  fetchSiteSettings,
} from '../services/catalogService';
import { Brand, CartItem, Category, Product, ProductVariant, SiteSettings } from '../types';
import { getEffectivePrice } from '../utils/format';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'error' | 'info';
}

interface StoreContextValue {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  siteSettings: SiteSettings;
  catalogLoading: boolean;
  catalogError: string | null;
  catalogSource: 'supabase' | 'preview';
  refreshCatalog: () => Promise<void>;

  cartItems: CartItem[];
  cartCount: number;
  subtotalPkr: number;
  originalSubtotalPkr: number;
  savingsPkr: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  wishlistProductIds: string[];
  wishlistProducts: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;

  compareProductIds: string[];
  compareProducts: Product[];
  isInCompare: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  recentlyViewedSlugs: string[];
  recordProductView: (slug: string) => void;

  toasts: ToastMessage[];
  showToast: (text: string, tone?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_SESSION_KEY = 'soleverse_bag_v1';
const WISHLIST_SESSION_KEY = 'soleverse_wishlist_v1';
const RECENT_SESSION_KEY = 'soleverse_recent_v1';
const COMPARE_SESSION_KEY = 'soleverse_compare_v1';
const SEARCH_HISTORY_KEY = 'soleverse_searches_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogSource, setCatalogSource] = useState<'supabase' | 'preview'>(
    isSupabaseConfigured ? 'supabase' : 'preview'
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(WISHLIST_SESSION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareProductIds, setCompareProductIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(COMPARE_SESSION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewedSlugs, setRecentlyViewedSlugs] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(RECENT_SESSION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, tone: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const [catalogRes, cats, loadedBrands, settings] = await Promise.all([
        fetchAllProducts(),
        fetchCategories(),
        fetchBrands(),
        fetchSiteSettings(),
      ]);
      setProducts(catalogRes.products);
      setCatalogSource(catalogRes.source);
      setCategories(cats);
      setBrands(loadedBrands);
      setSiteSettings(settings);
    } catch (err) {
      setCatalogError(err instanceof Error ? err.message : 'Unable to load catalog.');
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    if (products.length === 0 || user) return;
    try {
      const raw = sessionStorage.getItem(CART_SESSION_KEY);
      if (!raw) return;
      const saved: Array<{ product_id: string; variant_id: string; quantity: number }> =
        JSON.parse(raw);
      const hydrated: CartItem[] = [];
      for (const entry of saved) {
        const prod = products.find((p) => p.id === entry.product_id);
        const variant = prod?.variants.find((v) => v.id === entry.variant_id);
        if (prod && variant && variant.stock_quantity > 0) {
          hydrated.push({
            id: variant.id,
            product_id: prod.id,
            variant_id: variant.id,
            quantity: Math.min(entry.quantity, variant.stock_quantity),
            product: prod,
            variant,
          });
        }
      }
      setCartItems(hydrated);
    } catch {
      // ignore corrupted session storage
    }
  }, [products, user]);

  useEffect(() => {
    if (user) return;
    try {
      const minimal = cartItems.map((i) => ({
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
      }));
      sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(minimal));
    } catch {
      // ignore
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    let active = true;
    (async () => {
      try {
        const [dbCart, dbWish] = await Promise.all([
          fetchCartDb(user.id),
          fetchWishlistDb(user.id),
        ]);
        if (!active) return;

        if (cartItems.length > 0) {
          for (const localItem of cartItems) {
            const existing = dbCart.find((d) => d.variant_id === localItem.variant_id);
            const targetQty = Math.min(
              localItem.variant.stock_quantity,
              (existing?.quantity ?? 0) + localItem.quantity
            );
            if (targetQty > 0) {
              await upsertCartItemDb(user.id, localItem.product_id, localItem.variant_id, targetQty);
            }
          }
          const merged = await fetchCartDb(user.id);
          if (active) setCartItems(merged);
          sessionStorage.removeItem(CART_SESSION_KEY);
        } else {
          setCartItems(dbCart);
        }

        setWishlistIds(dbWish.map((w) => w.product_id));
      } catch {
        // silent fallback if user tables aren't ready
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = useCallback(
    async (product: Product, variant: ProductVariant, quantity = 1): Promise<boolean> => {
      if (!variant.is_active || variant.stock_quantity <= 0) {
        showToast('Selected size & colorway is currently out of stock.', 'error');
        return false;
      }

      const existing = cartItems.find((i) => i.variant_id === variant.id);
      const nextQty = (existing?.quantity ?? 0) + quantity;
      if (nextQty > variant.stock_quantity) {
        showToast(
          `Only ${variant.stock_quantity} pair${variant.stock_quantity === 1 ? '' : 's'} available in EU ${variant.size_eu}.`,
          'error'
        );
        return false;
      }

      setCartItems((prev) => {
        if (existing) {
          return prev.map((item) =>
            item.variant_id === variant.id ? { ...item, quantity: nextQty } : item
          );
        }
        return [
          ...prev,
          {
            id: variant.id,
            product_id: product.id,
            variant_id: variant.id,
            quantity: nextQty,
            product,
            variant,
          },
        ];
      });

      if (user && isSupabaseConfigured) {
        try {
          await upsertCartItemDb(user.id, product.id, variant.id, nextQty);
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Unable to sync bag.', 'error');
        }
      }

      showToast(`Added ${product.name} (EU ${variant.size_eu}) to your bag.`, 'success');
      setIsCartOpen(true);
      return true;
    },
    [cartItems, showToast, user]
  );

  const updateCartQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      const item = cartItems.find((i) => i.variant_id === variantId);
      if (!item) return;

      if (quantity <= 0) {
        setCartItems((prev) => prev.filter((i) => i.variant_id !== variantId));
        if (user && isSupabaseConfigured) {
          await removeCartItemDb(user.id, variantId).catch(() => {});
        }
        return;
      }

      if (quantity > item.variant.stock_quantity) {
        showToast(
          `Maximum available stock reached (${item.variant.stock_quantity} left).`,
          'error'
        );
        return;
      }

      setCartItems((prev) =>
        prev.map((i) => (i.variant_id === variantId ? { ...i, quantity } : i))
      );

      if (user && isSupabaseConfigured) {
        await upsertCartItemDb(user.id, item.product_id, variantId, quantity).catch(() => {});
      }
    },
    [cartItems, showToast, user]
  );

  const removeFromCart = useCallback(
    async (variantId: string) => {
      setCartItems((prev) => prev.filter((i) => i.variant_id !== variantId));
      if (user && isSupabaseConfigured) {
        await removeCartItemDb(user.id, variantId).catch(() => {});
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    setCartItems([]);
    sessionStorage.removeItem(CART_SESSION_KEY);
    if (user && isSupabaseConfigured) {
      await clearCartDb(user.id).catch(() => {});
    }
  }, [user]);

  const toggleWishlist = useCallback(
    async (product: Product) => {
      const exists = wishlistIds.includes(product.id);
      const next = exists
        ? wishlistIds.filter((id) => id !== product.id)
        : [product.id, ...wishlistIds];

      setWishlistIds(next);
      try {
        sessionStorage.setItem(WISHLIST_SESSION_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }

      if (user && isSupabaseConfigured) {
        try {
          if (exists) {
            await removeFromWishlistDb(user.id, product.id);
          } else {
            await addToWishlistDb(user.id, product.id);
          }
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Unable to sync wishlist.', 'error');
        }
      }

      showToast(
        exists ? `Removed ${product.name} from wishlist.` : `Saved ${product.name} to wishlist.`,
        'info'
      );
    },
    [wishlistIds, user, showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const isInCompare = useCallback(
    (productId: string) => compareProductIds.includes(productId),
    [compareProductIds]
  );

  const toggleCompare = useCallback(
    (product: Product) => {
      const exists = compareProductIds.includes(product.id);
      if (exists) {
        const next = compareProductIds.filter((id) => id !== product.id);
        setCompareProductIds(next);
        try {
          sessionStorage.setItem(COMPARE_SESSION_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        showToast(`Removed ${product.name} from comparison.`, 'info');
        return;
      }

      if (compareProductIds.length >= 3) {
        showToast('Comparison holds up to 3 sneakers at once. Remove one first.', 'error');
        return;
      }

      const next = [...compareProductIds, product.id];
      setCompareProductIds(next);
      try {
        sessionStorage.setItem(COMPARE_SESSION_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      showToast(`Added ${product.name} to comparison (${next.length}/3).`, 'success');
    },
    [compareProductIds, showToast]
  );

  const clearCompare = useCallback(() => {
    setCompareProductIds([]);
    try {
      sessionStorage.removeItem(COMPARE_SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  const compareProducts = useMemo(
    () => products.filter((p) => compareProductIds.includes(p.id)),
    [products, compareProductIds]
  );

  const addRecentSearch = useCallback((query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((q) => q.toLowerCase() !== clean.toLowerCase())].slice(
        0,
        6
      );
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  }, []);

  const recordProductView = useCallback((slug: string) => {
    setRecentlyViewedSlugs((prev) => {
      const updated = [slug, ...prev.filter((s) => s !== slug)].slice(0, 8);
      try {
        sessionStorage.setItem(RECENT_SESSION_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotalPkr = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
        0
      ),
    [cartItems]
  );

  const originalSubtotalPkr = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + Number(item.product.price_pkr) * item.quantity, 0),
    [cartItems]
  );

  const savingsPkr = Math.max(0, originalSubtotalPkr - subtotalPkr);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        siteSettings,
        catalogLoading,
        catalogError,
        catalogSource,
        refreshCatalog,
        cartItems,
        cartCount,
        subtotalPkr,
        originalSubtotalPkr,
        savingsPkr,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlistProductIds: wishlistIds,
        wishlistProducts,
        isInWishlist,
        toggleWishlist,
        compareProductIds,
        compareProducts,
        isInCompare,
        toggleCompare,
        clearCompare,
        quickViewProduct,
        openQuickView: (p) => setQuickViewProduct(p),
        closeQuickView: () => setQuickViewProduct(null),
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        recentlyViewedSlugs,
        recordProductView,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
