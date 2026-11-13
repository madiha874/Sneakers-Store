import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  GitCompareArrows,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  ZoomIn,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { ProductCard } from '../components/product/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchProductBySlug,
  fetchProductReviews,
  submitProductReview,
} from '../services/catalogService';
import { Product, Review } from '../types';
import {
  formatDate,
  formatPKR,
  getDiscountPercent,
  getEffectivePrice,
} from '../utils/format';

const SIZE_GUIDE_ROWS = [
  { eu: '37', uk: '4', usM: '5', usW: '6.5', cm: '23.5' },
  { eu: '38', uk: '5', usM: '6', usW: '7.5', cm: '24.1' },
  { eu: '39', uk: '5.5', usM: '6.5', usW: '8', cm: '24.8' },
  { eu: '40', uk: '6.5', usM: '7.5', usW: '9', cm: '25.4' },
  { eu: '41', uk: '7.5', usM: '8.5', usW: '10', cm: '26.2' },
  { eu: '42', uk: '8', usM: '9', usW: '10.5', cm: '26.8' },
  { eu: '43', uk: '9', usM: '10', usW: '11.5', cm: '27.6' },
  { eu: '44', uk: '9.5', usM: '10.5', usW: '12', cm: '28.3' },
  { eu: '45', uk: '10.5', usM: '11.5', usW: '13', cm: '29.2' },
];

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const {
    products,
    siteSettings,
    addToCart,
    isInWishlist,
    toggleWishlist,
    isInCompare,
    toggleCompare,
    recentlyViewedSlugs,
    recordProductView,
    showToast,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'materials' | 'delivery' | null>('delivery');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    setSelectedImageIdx(0);
    setQuantity(1);

    (async () => {
      try {
        const res = await fetchProductBySlug(slug);
        if (!active) return;
        const found = res.product ?? products.find((p) => p.slug === slug) ?? null;
        setProduct(found);
        if (found) {
          recordProductView(found.slug);
          const activeVariants = found.variants.filter((v) => v.is_active);
          const firstInStock =
            activeVariants.find((v) => v.stock_quantity > 0) ?? activeVariants[0];
          if (firstInStock) {
            setSelectedColor(firstInStock.color_name);
            setSelectedSize(firstInStock.size_eu);
          }
          if (isSupabaseConfigured) {
            const revs = await fetchProductReviews(found.id).catch(() => []);
            if (active) setReviews(revs as Review[]);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug, products, recordProductView]);

  const colors = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Map(
        product.variants
          .filter((v) => v.is_active)
          .map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])
      ).values()
    );
  }, [product]);

  const sizesForColor = useMemo(() => {
    if (!product) return [];
    return product.variants
      .filter((v) => v.is_active && (!selectedColor || v.color_name === selectedColor))
      .sort((a, b) => Number(a.size_eu) - Number(b.size_eu));
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return (
      product.variants.find(
        (v) =>
          v.is_active &&
          v.color_name === selectedColor &&
          v.size_eu === selectedSize
      ) ?? null
    );
  }, [product, selectedColor, selectedSize]);

  const maxStock = selectedVariant?.stock_quantity ?? 0;

  useEffect(() => {
    if (maxStock > 0 && quantity > maxStock) {
      setQuantity(maxStock);
    }
  }, [maxStock, quantity]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category_id === product.category_id || p.collection_type === product.collection_type)
      )
      .slice(0, 4);
  }, [product, products]);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedSlugs
      .filter((s) => s !== slug)
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p))
      .slice(0, 4);
  }, [recentlyViewedSlugs, products, slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 aspect-[4/3] bg-[#EDEAE2] dark:bg-[#202126] animate-pulse" />
        <div className="lg:col-span-5 space-y-4">
          <div className="h-8 bg-[#EDEAE2] dark:bg-[#202126] w-3/4 animate-pulse" />
          <div className="h-6 bg-[#EDEAE2] dark:bg-[#202126] w-1/3 animate-pulse" />
          <div className="h-24 bg-[#EDEAE2] dark:bg-[#202126] w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl font-semibold mb-3">Sneaker Not Found</h1>
        <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mb-6">
          This silhouette may have been archived or moved to a seasonal collection.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = [...product.images].sort((a, b) => a.display_order - b.display_order);
  const currentImg = images[selectedImageIdx]?.image_url ?? '/images/banners/hero-flagship.jpg';
  const effectivePrice = getEffectivePrice(product);
  const discountPct = getDiscountPercent(product);
  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);
  const whatsappDigits = (siteSettings.store.whatsapp_number || '923000000000').replace(/\D/g, '');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      showToast('Please select an available EU size and colorway.', 'error');
      return;
    }
    await addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      showToast('Please select an available EU size and colorway.', 'error');
      return;
    }
    const ok = await addToCart(product, selectedVariant, quantity);
    if (ok) {
      navigate('/checkout');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to submit a verified review.', 'info');
      navigate('/login');
      return;
    }
    if (!isSupabaseConfigured) {
      showToast('Configure Supabase environment variables to post reviews.', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please share a brief comment about fit and quality.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const created = await submitProductReview({
        productId: product.id,
        userId: user.id,
        authorName: profile?.full_name || user.email?.split('@')[0] || 'SOLEVERSE Collector',
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
      });
      setReviews((prev) => [created as Review, ...prev]);
      setReviewTitle('');
      setReviewComment('');
      showToast('Thank you. Your review has been published.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to post review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <SeoHead
        title={`${product.name} · ${product.brand}`}
        description={product.short_description}
        canonicalPath={`/product/${product.slug}`}
        product={product}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-[#52525B] dark:text-[#C5C7CB] mb-6 flex items-center gap-2"
        >
          <Link to="/" className="hover:text-[#101114] dark:hover:text-[#D7FF45]">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#101114] dark:hover:text-[#D7FF45]">
            Sneakers
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/shop?category=${product.category.slug}`}
                className="hover:text-[#101114] dark:hover:text-[#D7FF45]"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#101114] dark:text-[#F5F3ED] font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Contiguous Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Gallery with Interactive Zoom */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div
              onMouseEnter={() => setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setZoomActive((z) => !z)}
              className="relative aspect-[4/3] w-full bg-[#EDEAE2] dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 overflow-hidden cursor-zoom-in"
            >
              <SafeImage
                src={currentImg}
                alt={images[selectedImageIdx]?.alt_text || product.name}
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-300"
                style={
                  zoomActive
                    ? {
                        transform: 'scale(1.65)',
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      }
                    : undefined
                }
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F5F3ED]/95 dark:bg-[#101114]/90 text-[11px] font-medium text-[#101114] dark:text-[#F5F3ED] border border-black/10 dark:border-white/10">
                <ZoomIn className="w-3.5 h-3.5" />
                {zoomActive ? 'Zoom Active' : 'Hover to Inspect'}
              </span>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`aspect-[4/3] bg-[#EDEAE2] dark:bg-[#202126] border overflow-hidden transition-all ${
                      selectedImageIdx === idx
                        ? 'border-[#101114] dark:border-[#D7FF45] ring-1 ring-[#101114] dark:ring-[#D7FF45]'
                        : 'border-[#C5C7CB]/60 dark:border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img.image_url}
                      alt={img.alt_text || `${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Purchase & Variant Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-3 text-xs text-[#52525B] dark:text-[#C5C7CB] mb-2">
                <span>
                  {product.brand} · <span className="font-mono">{product.sku}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[#101114] dark:text-[#F5F3ED]">
                  <Star className="w-3.5 h-3.5 fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45]" />
                  {product.rating_avg.toFixed(1)} ({product.review_count})
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#101114] dark:text-[#F5F3ED] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-mono tabular-nums text-2xl font-semibold text-[#101114] dark:text-[#D7FF45]">
                  {formatPKR(effectivePrice)}
                </span>
                {discountPct > 0 && (
                  <>
                    <span className="font-mono tabular-nums text-base text-[#71717A] dark:text-[#C5C7CB]/50 line-through">
                      {formatPKR(product.price_pkr)}
                    </span>
                    <span className="px-2 py-0.5 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-wider">
                      Save {discountPct}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-[#3F3F46] dark:text-[#C5C7CB] leading-relaxed">
              {product.description}
            </p>

            {/* Colorway selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                  Colorway
                </span>
                <span className="font-medium text-[#101114] dark:text-[#F5F3ED]">
                  {selectedColor}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => {
                  const active = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        const validForCol = product.variants.find(
                          (v) =>
                            v.is_active &&
                            v.color_name === c.name &&
                            v.size_eu === selectedSize &&
                            v.stock_quantity > 0
                        );
                        if (!validForCol) {
                          const fallback = product.variants.find(
                            (v) => v.is_active && v.color_name === c.name && v.stock_quantity > 0
                          );
                          if (fallback) setSelectedSize(fallback.size_eu);
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 border text-xs font-medium transition-colors ${
                        active
                          ? 'border-[#101114] dark:border-[#D7FF45] bg-white dark:bg-[#202126] text-[#101114] dark:text-[#F5F3ED] ring-1 ring-[#101114] dark:ring-[#D7FF45]'
                          : 'border-[#C5C7CB]/60 dark:border-white/15 bg-[#F5F3ED] dark:bg-[#101114] text-[#3F3F46] dark:text-[#C5C7CB] hover:border-[#101114] dark:hover:border-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/25"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EU Size selector + Size Guide trigger */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center gap-3">
                  <span className="uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                    Select EU Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[#101114] dark:text-[#D7FF45] underline underline-offset-4 hover:opacity-75"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                {selectedVariant ? (
                  <span
                    className={`font-mono ${
                      maxStock === 0
                        ? 'text-red-500'
                        : maxStock <= 4
                          ? 'text-amber-600 dark:text-[#D7FF45]'
                          : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {maxStock === 0
                      ? 'Out of Stock'
                      : maxStock <= 4
                        ? `Low Stock · ${maxStock} Left`
                        : `In Stock · ${maxStock} Ready`}
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sizesForColor.map((variant) => {
                  const active = selectedSize === variant.size_eu;
                  const unavailable = variant.stock_quantity <= 0;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={unavailable}
                      onClick={() => setSelectedSize(variant.size_eu)}
                      className={`py-2.5 font-mono text-xs font-semibold border transition-colors ${
                        unavailable
                          ? 'border-[#C5C7CB]/40 dark:border-white/10 bg-[#EDEAE2] dark:bg-[#101114] text-[#A1A1AA] line-through cursor-not-allowed'
                          : active
                            ? 'border-[#101114] dark:border-[#D7FF45] bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                            : 'border-[#C5C7CB]/60 dark:border-white/15 bg-white dark:bg-[#202126] text-[#101114] dark:text-[#F5F3ED] hover:border-[#101114] dark:hover:border-white'
                      }`}
                    >
                      {variant.size_eu}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Primary CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center border border-[#C5C7CB]/60 dark:border-white/15 bg-white dark:bg-[#202126] h-12">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-full flex items-center justify-center hover:bg-[#EDEAE2] dark:hover:bg-white/10 disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center font-mono tabular-nums text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={maxStock === 0 || quantity >= maxStock}
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    aria-label="Increase quantity"
                    className="w-10 h-full flex items-center justify-center hover:bg-[#EDEAE2] dark:hover:bg-white/10 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!selectedVariant || maxStock <= 0}
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] hover:opacity-90 disabled:opacity-40 text-xs font-bold uppercase tracking-[0.16em] transition-opacity inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {maxStock <= 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Toggle wishlist"
                  className="w-12 h-12 border border-[#C5C7CB]/60 dark:border-white/15 bg-white dark:bg-[#202126] hover:border-[#101114] dark:hover:border-[#D7FF45] flex items-center justify-center transition-colors shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlisted ? 'fill-[#101114] dark:fill-[#D7FF45] text-[#101114] dark:text-[#D7FF45]' : ''
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(product)}
                  aria-label="Compare sneaker"
                  title="Compare up to 3 models"
                  className={`w-12 h-12 border flex items-center justify-center transition-colors shrink-0 ${
                    compared
                      ? 'bg-[#D7FF45] border-[#101114]/20 text-[#101114]'
                      : 'border-[#C5C7CB]/60 dark:border-white/15 bg-white dark:bg-[#202126] hover:border-[#101114] dark:hover:border-[#D7FF45]'
                  }`}
                >
                  <GitCompareArrows className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!selectedVariant || maxStock <= 0}
                onClick={handleBuyNow}
                className="w-full h-12 border border-[#101114] dark:border-white/25 bg-white dark:bg-[#202126] hover:bg-[#101114] hover:text-white dark:hover:bg-[#D7FF45] dark:hover:text-[#101114] dark:hover:border-[#D7FF45] disabled:opacity-40 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
              >
                Buy Now — Cash on Delivery
              </button>

              <a
                href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                  `Hi SOLEVERSE, I have a sizing question about ${product.name} (${product.sku}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-xs text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-[#D7FF45] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ask Fit Specialist on WhatsApp
              </a>
            </div>

            {/* Delivery & Materials Accordions */}
            <div className="border-t border-[#C5C7CB]/50 dark:border-white/10 pt-4 divide-y divide-[#C5C7CB]/40 dark:divide-white/10">
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion((v) => (v === 'materials' ? null : 'materials'))
                  }
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.14em]"
                >
                  <span>Materials & Craftsmanship</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'materials' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'materials' && (
                  <p className="pb-4 text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
                    {product.material_notes}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion((v) => (v === 'delivery' ? null : 'delivery'))
                  }
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.14em]"
                >
                  <span>Delivery, COD & Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'delivery' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="pb-4 space-y-2.5 text-sm text-[#52525B] dark:text-[#C5C7CB]">
                    <p className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#101114] dark:text-[#D7FF45] shrink-0" />
                      <span>2–4 business days nationwide Cash on Delivery (free above PKR 25,000).</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[#101114] dark:text-[#D7FF45] shrink-0" />
                      <span>14-day unworn size exchange and return guarantee.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#101114] dark:text-[#D7FF45] shrink-0" />
                      <span>12-point authenticity & craftsmanship verification seal.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-20 pt-14 border-t border-[#C5C7CB]/60 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold">
                Client Feedback
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold">
                Verified Reviews
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-4xl font-semibold">
                  {product.rating_avg.toFixed(1)}
                </span>
                <div className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                  <div className="flex items-center gap-1 text-[#101114] dark:text-[#D7FF45] mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  Based on {Math.max(product.review_count, reviews.length)} verified ratings
                </div>
              </div>

              <form
                onSubmit={handleSubmitReview}
                className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-5 space-y-3 mt-6"
              >
                <h3 className="text-sm font-semibold">Leave a Review</h3>
                <div>
                  <label className="block text-xs text-[#52525B] dark:text-[#C5C7CB] mb-1">
                    Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#C5C7CB]/60 dark:border-white/10 text-sm bg-[#F5F3ED] dark:bg-[#101114]"
                  >
                    <option value={5}>5 Stars — Exceptional</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Satisfactory</option>
                    <option value={2}>2 Stars — Fair</option>
                    <option value={1}>1 Star — Needs Improvement</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Headline (e.g., True to EU size)"
                  className="w-full px-3 py-2 border border-[#C5C7CB]/60 dark:border-white/10 text-sm bg-[#F5F3ED] dark:bg-[#101114]"
                />
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share notes on leather quality, comfort, and sizing..."
                  className="w-full px-3 py-2 border border-[#C5C7CB]/60 dark:border-white/10 text-sm bg-[#F5F3ED] dark:bg-[#101114]"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em] hover:opacity-90 disabled:opacity-50"
                >
                  {submittingReview ? 'Publishing...' : 'Submit Review'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-8 text-sm text-[#52525B] dark:text-[#C5C7CB]">
                  No written reviews published yet for this silhouette in the live database. Be the
                  first verified customer to share your fit impressions.
                </div>
              ) : (
                reviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{rev.author_name}</span>
                        {rev.is_verified_purchase && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-[#D7FF45]">
                            <Check className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#71717A] dark:text-[#C5C7CB]/70">
                        {formatDate(rev.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#101114] dark:text-[#D7FF45] mb-2">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {rev.title && <h4 className="text-sm font-semibold mb-1">{rev.title}</h4>}
                    <p className="text-sm text-[#3F3F46] dark:text-[#C5C7CB] leading-relaxed">
                      {rev.comment}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-14 border-t border-[#C5C7CB]/60 dark:border-white/10">
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold mb-8">
              Related Silhouettes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <section className="mt-16 pt-14 border-t border-[#C5C7CB]/60 dark:border-white/10">
            <h2 className="font-editorial text-2xl font-semibold mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Interactive Size Guide Modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSizeGuideOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="SOLEVERSE Sneaker Size Guide"
              className="w-full max-w-xl bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/15 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#C5C7CB]/50 dark:border-white/10 mb-4">
                <div>
                  <h2 className="font-editorial text-xl font-semibold">EU Sneaker Size Chart</h2>
                  <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-0.5">
                    Measure foot length standing heel-to-toe in centimeters. True to European sizing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(false)}
                  aria-label="Close size guide"
                  className="p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#EDEAE2] dark:bg-[#101114] text-[#52525B] dark:text-[#C5C7CB] uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-2.5">EU</th>
                      <th className="px-3 py-2.5">UK</th>
                      <th className="px-3 py-2.5">US Men</th>
                      <th className="px-3 py-2.5">US Women</th>
                      <th className="px-3 py-2.5">Foot Length (CM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEAE2] dark:divide-white/10 font-mono">
                    {SIZE_GUIDE_ROWS.map((row) => (
                      <tr key={row.eu} className="hover:bg-[#F5F3ED] dark:hover:bg-white/5">
                        <td className="px-3 py-2 font-semibold">EU {row.eu}</td>
                        <td className="px-3 py-2">{row.uk}</td>
                        <td className="px-3 py-2">{row.usM}</td>
                        <td className="px-3 py-2">{row.usW}</td>
                        <td className="px-3 py-2">{row.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
