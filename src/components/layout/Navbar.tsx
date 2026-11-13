import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Award,
  ChevronRight,
  Clock,
  Compass,
  Flame,
  Footprints,
  Heart,
  Home,
  Info,
  Layers,
  Mail,
  Menu,
  Moon,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Tag,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { formatPKR, getEffectivePrice, getPrimaryImage } from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

type MegaKey = 'men' | 'women' | 'running' | 'sports' | 'collections' | null;

const MEGA_MENU_CONFIG: Record<
  Exclude<MegaKey, null>,
  {
    title: string;
    subtitle: string;
    basePath: string;
    subcategories: Array<{ label: string; to: string }>;
    featuredSlug: string;
  }
> = {
  men: {
    title: "Men's Footwear",
    subtitle: 'Architectural calfskin courts, high-tops, and daily trainers.',
    basePath: '/collections/men',
    subcategories: [
      { label: 'Casual Sneakers', to: '/shop?gender=men&collection=casual' },
      { label: 'Running Shoes', to: '/shop?gender=men&collection=running' },
      { label: 'Sports Shoes', to: '/shop?gender=men&collection=sports' },
      { label: 'Training Shoes', to: '/shop?gender=men&collection=training' },
      { label: 'Lifestyle Sneakers', to: '/shop?gender=men&collection=lifestyle' },
      { label: 'Walking Shoes', to: '/shop?gender=men&collection=walking' },
      { label: 'High-Top Sneakers', to: '/shop?gender=men&collection=high-top' },
      { label: 'Low-Top Sneakers', to: '/shop?gender=men&collection=low-top' },
      { label: 'Latest Collections', to: '/collections/new-arrivals' },
    ],
    featuredSlug: 'sv-01-obsidian-apex-low',
  },
  women: {
    title: "Women's Atelier",
    subtitle: 'Sculptural profiles in pearl leather, brushed suede, and cloud cushioning.',
    basePath: '/collections/women',
    subcategories: [
      { label: 'Casual Sneakers', to: '/shop?gender=women&collection=casual' },
      { label: 'Running Shoes', to: '/shop?gender=women&collection=running' },
      { label: 'Training Shoes', to: '/shop?gender=women&collection=training' },
      { label: 'Lifestyle Sneakers', to: '/shop?gender=women&collection=lifestyle' },
      { label: 'Walking Shoes', to: '/shop?gender=women&collection=walking' },
      { label: 'High-Top Sneakers', to: '/shop?gender=women&collection=high-top' },
      { label: 'Low-Top Sneakers', to: '/shop?gender=women&collection=low-top' },
      { label: 'Latest Collections', to: '/collections/new-arrivals' },
    ],
    featuredSlug: 'sv-02-alabaster-court-minimal',
  },
  running: {
    title: 'Running Lab',
    subtitle: 'Carbon-plated race engines and nitrogen-foam distance trainers.',
    basePath: '/collections/running',
    subcategories: [
      { label: 'Marathon & Carbon Racers', to: '/shop?collection=running&sort=price_desc' },
      { label: 'Daily Road Trainers', to: '/shop?collection=running' },
      { label: 'Trail & All-Terrain', to: '/shop?collection=sports' },
      { label: 'Walking & Recovery', to: '/shop?collection=walking' },
      { label: 'New Running Releases', to: '/collections/new-arrivals' },
    ],
    featuredSlug: 'sv-05-cobalt-aero-carbon',
  },
  sports: {
    title: 'Sports & Training',
    subtitle: 'Lateral court stability, trail lugs, and high-output studio silhouettes.',
    basePath: '/collections/sports',
    subcategories: [
      { label: 'Sports Shoes', to: '/shop?collection=sports' },
      { label: 'Training Shoes', to: '/shop?collection=training' },
      { label: 'High-Top Court', to: '/shop?collection=high-top' },
      { label: 'Lifestyle Heritage', to: '/shop?collection=lifestyle' },
      { label: 'Best-Selling Gear', to: '/collections/best-sellers' },
    ],
    featuredSlug: 'sv-04-pine-ridge-gtx-trail',
  },
  collections: {
    title: 'Curated Collections & Houses',
    subtitle: 'Explore trending drops, numbered Atelier reserves, and designer labels.',
    basePath: '/shop',
    subcategories: [
      { label: 'Shop All Sneakers', to: '/shop' },
      { label: 'Trending Now', to: '/collections/trending' },
      { label: 'New Arrivals', to: '/collections/new-arrivals' },
      { label: 'Best Sellers', to: '/collections/best-sellers' },
      { label: 'Archive Sale', to: '/collections/sale' },
      { label: 'Designer Brands', to: '/brands' },
      { label: 'Compare Models', to: '/compare' },
    ],
    featuredSlug: 'sv-06-slate-monolith-high',
  },
};

export function Navbar() {
  const {
    products,
    cartCount,
    wishlistProductIds,
    openCart,
    siteSettings,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useStore();
  const { user, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaKey>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveMega(null);
    setSidebarOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setActiveMega(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category?.name.toLowerCase().includes(q) ?? false)
      )
      .slice(0, 6);
  }, [products, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    addRecentSearch(q);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const featuredMegaProduct = useMemo(() => {
    if (!activeMega) return null;
    const slug = MEGA_MENU_CONFIG[activeMega].featuredSlug;
    return products.find((p) => p.slug === slug) ?? products[0] ?? null;
  }, [activeMega, products]);

  const sidebarItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Shop All', to: '/shop', icon: Compass },
    { label: 'Men', to: '/collections/men', icon: Footprints },
    { label: 'Women', to: '/collections/women', icon: Sparkles },
    { label: 'Running', to: '/collections/running', icon: Activity },
    { label: 'Sports', to: '/collections/sports', icon: Trophy },
    { label: 'New Arrivals', to: '/collections/new-arrivals', icon: Sparkles },
    { label: 'Best Sellers', to: '/collections/best-sellers', icon: Award },
    { label: 'Trending', to: '/collections/trending', icon: Flame },
    { label: 'Sale', to: '/collections/sale', icon: Tag },
    { label: 'Brands', to: '/brands', icon: Layers },
    { label: 'Wishlist', to: '/wishlist', icon: Heart },
    { label: 'My Account', to: user ? '/account' : '/login', icon: User },
    { label: 'My Orders', to: '/account/orders', icon: Package },
    { label: 'Cart', to: '/cart', icon: ShoppingBag },
    { label: 'About Us', to: '/about', icon: Info },
    { label: 'Contact Us', to: '/contact', icon: Mail },
  ];

  return (
    <div ref={headerRef} className="sticky top-0 z-40">
      {/* Slim Announcement Bar */}
      {siteSettings.announcement.enabled && !announcementDismissed && (
        <div className="bg-[#101114] text-[#F5F3ED] h-9 px-4 flex items-center justify-between text-xs border-b border-white/10">
          <div className="w-6 hidden sm:block" />
          <Link
            to={siteSettings.announcement.link_url || '/shop'}
            className="truncate text-center tracking-wide hover:text-[#D7FF45] transition-colors"
          >
            {siteSettings.announcement.text}
          </Link>
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            aria-label="Dismiss announcement"
            className="p-1 text-[#C5C7CB] hover:text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <header
        className="bg-[#F5F3ED]/95 dark:bg-[#101114]/95 backdrop-blur-md border-b border-[#C5C7CB]/60 dark:border-white/10 transition-colors duration-200"
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-6">
          {/* Left: Collapsible Sidebar Toggle + Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open side navigation panel"
              title="Browse Directory"
              className="w-10 h-10 -ml-2 flex items-center justify-center text-[#101114] dark:text-[#F5F3ED] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              to="/"
              className="font-editorial text-xl sm:text-2xl font-semibold tracking-[0.14em] text-[#101114] dark:text-[#F5F3ED] whitespace-nowrap shrink-0"
            >
              SOLEVERSE
            </Link>
          </div>

          {/* Center: Single-line Primary Navigation with Mega Menu triggers */}
          <nav
            aria-label="Main navigation"
            className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-[#3F3F46] dark:text-[#C5C7CB]"
          >
            <Link
              to="/"
              className="whitespace-nowrap shrink-0 hover:text-[#101114] dark:hover:text-[#F5F3ED] transition-colors py-5"
            >
              Home
            </Link>
            {(['men', 'women', 'running', 'sports'] as const).map((key) => (
              <div key={key} onMouseEnter={() => setActiveMega(key)} className="relative py-5">
                <Link
                  to={MEGA_MENU_CONFIG[key].basePath}
                  className={`whitespace-nowrap shrink-0 capitalize transition-colors ${
                    activeMega === key
                      ? 'text-[#101114] dark:text-[#D7FF45] underline underline-offset-4'
                      : 'hover:text-[#101114] dark:hover:text-[#F5F3ED]'
                  }`}
                >
                  {key}
                </Link>
              </div>
            ))}
            <Link
              to="/collections/new-arrivals"
              className="whitespace-nowrap shrink-0 hover:text-[#101114] dark:hover:text-[#F5F3ED] transition-colors py-5"
            >
              New Arrivals
            </Link>
            <Link
              to="/collections/best-sellers"
              className="whitespace-nowrap shrink-0 hover:text-[#101114] dark:hover:text-[#F5F3ED] transition-colors py-5"
            >
              Best Sellers
            </Link>
            <div onMouseEnter={() => setActiveMega('collections')} className="relative py-5">
              <Link
                to="/shop"
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  activeMega === 'collections'
                    ? 'text-[#101114] dark:text-[#D7FF45] underline underline-offset-4'
                    : 'hover:text-[#101114] dark:hover:text-[#F5F3ED]'
                }`}
              >
                Collections
              </Link>
            </div>
            <Link
              to="/collections/sale"
              className="whitespace-nowrap shrink-0 px-2 py-0.5 bg-[#D7FF45] text-[#101114] font-bold uppercase text-[11px] tracking-[0.12em] hover:brightness-95 transition-all"
            >
              Sale
            </Link>
          </nav>

          {/* Compact tablet nav (lg..xl) */}
          <nav
            aria-label="Compact navigation"
            className="hidden lg:flex xl:hidden items-center gap-4 text-[13px] font-medium text-[#3F3F46] dark:text-[#C5C7CB]"
          >
            <Link to="/shop" className="whitespace-nowrap hover:text-[#101114] dark:hover:text-white">
              Shop
            </Link>
            <Link to="/collections/men" className="whitespace-nowrap hover:text-[#101114] dark:hover:text-white">
              Men
            </Link>
            <Link to="/collections/women" className="whitespace-nowrap hover:text-[#101114] dark:hover:text-white">
              Women
            </Link>
            <Link to="/collections/running" className="whitespace-nowrap hover:text-[#101114] dark:hover:text-white">
              Running
            </Link>
            <Link to="/brands" className="whitespace-nowrap hover:text-[#101114] dark:hover:text-white">
              Brands
            </Link>
            <Link
              to="/collections/sale"
              className="whitespace-nowrap px-2 py-0.5 bg-[#D7FF45] text-[#101114] font-bold uppercase text-[11px] tracking-[0.1em]"
            >
              Sale
            </Link>
          </nav>

          {/* Right: Search, Theme Toggle, Admin, Account, Wishlist, Bag */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search sneakers"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#101114] dark:text-[#F5F3ED] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>

            {/* Animated Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              title={isDark ? 'Day Mode' : 'Night Mode'}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#101114] dark:text-[#D7FF45] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
            >
              <motion.div
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -45, scale: 0.75, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.22 }}
              >
                {isDark ? (
                  <Sun className="w-[18px] h-[18px]" strokeWidth={1.75} />
                ) : (
                  <Moon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                )}
              </motion.div>
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin dashboard"
                title="Admin Portal"
                className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center text-[#101114] dark:text-[#D7FF45] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
              >
                <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </Link>
            )}

            <Link
              to={user ? '/account' : '/login'}
              aria-label={user ? 'My account' : 'Sign in'}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#101114] dark:text-[#F5F3ED] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#101114] dark:text-[#F5F3ED] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
            >
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {wishlistProductIds.length > 0 && (
                <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 bg-[#D7FF45] text-[#101114] font-mono font-bold text-[10px] leading-4 text-center rounded-full">
                  {wishlistProductIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative h-9 sm:h-10 px-2.5 flex items-center gap-1.5 text-[#101114] dark:text-[#F5F3ED] hover:bg-[#EDEAE2] dark:hover:bg-[#202126] transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
              <span className="font-mono tabular-nums text-xs font-semibold">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Desktop Interactive Mega Menu */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="hidden lg:block absolute left-0 right-0 top-full bg-[#F5F3ED] dark:bg-[#202126] border-b border-[#C5C7CB]/60 dark:border-white/10 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
                <div className="col-span-4 border-r border-[#C5C7CB]/60 dark:border-white/10 pr-6">
                  <span className="inline-block px-2 py-0.5 bg-[#D7FF45] text-[#101114] text-[10px] uppercase tracking-[0.16em] font-bold mb-3">
                    Collection Directory
                  </span>
                  <h3 className="font-editorial text-2xl font-semibold text-[#101114] dark:text-[#F5F3ED] mb-2">
                    {MEGA_MENU_CONFIG[activeMega].title}
                  </h3>
                  <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mb-6 leading-relaxed">
                    {MEGA_MENU_CONFIG[activeMega].subtitle}
                  </p>
                  <Link
                    to={MEGA_MENU_CONFIG[activeMega].basePath}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] hover:opacity-75 transition-opacity"
                  >
                    Explore Full Collection
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="col-span-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#52525B] dark:text-[#C5C7CB] font-medium mb-3">
                    Silhouettes & Disciplines
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {MEGA_MENU_CONFIG[activeMega].subcategories.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to={sub.to}
                          className="text-sm text-[#101114] dark:text-[#F5F3ED] hover:underline underline-offset-4 dark:hover:text-[#D7FF45] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {featuredMegaProduct && (
                  <div className="col-span-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#52525B] dark:text-[#C5C7CB] font-medium mb-3">
                      Featured Release
                    </p>
                    <Link
                      to={`/product/${featuredMegaProduct.slug}`}
                      className="group flex gap-4 bg-white dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/10 p-3 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors"
                    >
                      <div className="w-28 aspect-[4/3] bg-[#EDEAE2] dark:bg-[#202126] overflow-hidden shrink-0">
                        <SafeImage
                          src={getPrimaryImage(featuredMegaProduct)}
                          alt={featuredMegaProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <span className="text-[11px] uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                          {featuredMegaProduct.brand}
                        </span>
                        <span className="text-sm font-semibold text-[#101114] dark:text-[#F5F3ED] truncate">
                          {featuredMegaProduct.name}
                        </span>
                        <span className="font-mono tabular-nums text-xs font-semibold text-[#101114] dark:text-[#D7FF45] mt-1">
                          {formatPKR(getEffectivePrice(featuredMegaProduct))}
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable Search Bar with Recent Searches & Live Suggestions */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border-t border-[#C5C7CB]/60 dark:border-white/10 bg-white dark:bg-[#202126] overflow-hidden"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#52525B] dark:text-[#C5C7CB] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sneakers by model, brand, category, or SKU..."
                    className="w-full py-2 text-sm text-[#101114] dark:text-[#F5F3ED] placeholder:text-[#71717A] dark:placeholder:text-[#C5C7CB]/60 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-wider hover:opacity-90 shrink-0"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="p-2 text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>

                {/* Recent Searches */}
                {searchQuery.trim().length === 0 && recentSearches.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EDEAE2] dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-[#52525B] dark:text-[#C5C7CB]">
                        <Clock className="w-3 h-3" />
                        Recent:
                      </span>
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                          }}
                          className="px-2.5 py-1 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/10 text-xs text-[#101114] dark:text-[#F5F3ED] hover:border-[#101114] dark:hover:border-[#D7FF45]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] text-[#52525B] dark:text-[#C5C7CB] hover:underline"
                    >
                      Clear History
                    </button>
                  </div>
                )}

                {searchQuery.trim().length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EDEAE2] dark:border-white/10">
                    {suggestions.length === 0 ? (
                      <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] py-2">
                        No sneakers matched &ldquo;{searchQuery}&rdquo;. Try searching &ldquo;Carbon&rdquo;,
                        &ldquo;Obsidian&rdquo;, &ldquo;Veloce&rdquo;, or &ldquo;Running&rdquo;.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestions.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.slug}`}
                            onClick={() => {
                              addRecentSearch(searchQuery.trim());
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-[#F5F3ED] dark:hover:bg-[#101114] transition-colors"
                          >
                            <SafeImage
                              src={getPrimaryImage(p)}
                              alt={p.name}
                              className="w-14 h-11 object-cover bg-[#EDEAE2] dark:bg-[#101114] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[#101114] dark:text-[#F5F3ED] truncate">
                                {p.name}
                              </p>
                              <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] truncate">
                                {p.brand} · {p.category?.name}
                              </p>
                            </div>
                            <span className="font-mono tabular-nums text-xs font-semibold text-[#101114] dark:text-[#D7FF45]">
                              {formatPKR(getEffectivePrice(p))}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Interactive Collapsible Side Navigation Panel (All Viewports) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              aria-label="Side navigation panel"
              className="relative w-80 max-w-[85vw] bg-[#F5F3ED] dark:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] border-r border-[#C5C7CB]/60 dark:border-white/10 h-full overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="h-16 px-5 border-b border-[#C5C7CB]/60 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#202126]">
                  <span className="font-editorial text-xl font-semibold tracking-[0.14em]">
                    SOLEVERSE
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                      className="w-9 h-9 flex items-center justify-center text-[#101114] dark:text-[#D7FF45] hover:bg-[#EDEAE2] dark:hover:bg-[#101114]"
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Close side navigation panel"
                      className="w-9 h-9 flex items-center justify-center text-[#101114] dark:text-[#F5F3ED] hover:bg-[#EDEAE2] dark:hover:bg-[#101114]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={`${item.label}-${item.to}`}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center justify-between py-2.5 px-3 text-sm font-medium transition-all ${
                          active
                            ? 'bg-[#D7FF45] text-[#101114] font-semibold'
                            : 'text-[#101114] dark:text-[#F5F3ED] hover:bg-white dark:hover:bg-[#202126]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                              active
                                ? 'text-[#101114]'
                                : 'text-[#52525B] dark:text-[#C5C7CB] group-hover:text-[#101114] dark:group-hover:text-[#D7FF45]'
                            }`}
                          />
                          <span>{item.label}</span>
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                            active ? 'text-[#101114]' : 'text-[#71717A] dark:text-[#C5C7CB]/60'
                          }`}
                        />
                      </Link>
                    );
                  })}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="mt-3 flex items-center justify-between py-2.5 px-3 text-sm font-semibold bg-[#101114] dark:bg-[#202126] text-[#D7FF45] border border-white/10"
                    >
                      <span className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Command Console</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </nav>
              </div>

              <div className="p-5 border-t border-[#C5C7CB]/60 dark:border-white/10 bg-[#EDEAE2] dark:bg-[#202126] text-xs text-[#52525B] dark:text-[#C5C7CB]">
                Cash on Delivery Nationwide · 14-Day Inspection & Exchange
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
