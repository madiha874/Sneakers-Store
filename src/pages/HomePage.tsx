import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Play,
  Shield,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { ProductCard } from '../components/product/ProductCard';
import { useStore } from '../context/StoreContext';

type SpotlightTab = 'bestsellers' | 'trending' | 'exclusive';
type DisciplineTab = 'men' | 'women' | 'running' | 'sports';

const TESTIMONIALS = [
  {
    name: 'Zainab Tariq',
    role: 'Architect & Marathoner, Lahore',
    quote:
      'The Cobalt Aero Carbon shaved four minutes off my Islamabad half-marathon. Delivery arrived in Gulberg within 48 hours via Cash on Delivery in museum-grade packaging.',
    model: 'Cobalt Aero Carbon',
  },
  {
    name: 'Hamza Qureshi',
    role: 'Creative Director, Karachi',
    quote:
      'I have worn European minimalist courts for years, and the Obsidian Apex Low stands shoulder-to-shoulder with Italian houses at twice the price. Zero break-in time.',
    model: 'Obsidian Apex Low',
  },
  {
    name: 'Ayesha Mansoor',
    role: 'Studio Founder, Islamabad',
    quote:
      'Alabaster Court Minimal feels effortless from morning client meetings through evening gallery openings. Ordering with exact EU sizing and COD inspection made it seamless.',
    model: 'Alabaster Court Minimal',
  },
];

export function HomePage() {
  const { products, categories, brands, catalogLoading } = useStore();
  const [spotlightTab, setSpotlightTab] = useState<SpotlightTab>('bestsellers');
  const [disciplineTab, setDisciplineTab] = useState<DisciplineTab>('men');
  const [heroVideoError, setHeroVideoError] = useState(false);
  const [labVideoError, setLabVideoError] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroMediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.is_featured).slice(0, 4),
    [products]
  );

  const newArrivals = useMemo(
    () => products.filter((p) => p.is_new_arrival).slice(0, 4),
    [products]
  );

  const spotlightProducts = useMemo(() => {
    if (spotlightTab === 'bestsellers') {
      return products.filter((p) => p.is_bestseller).slice(0, 4);
    }
    if (spotlightTab === 'trending') {
      return products.filter((p) => p.is_trending).slice(0, 4);
    }
    return products.filter((p) => p.is_exclusive).slice(0, 4);
  }, [products, spotlightTab]);

  const disciplineProducts = useMemo(() => {
    switch (disciplineTab) {
      case 'men':
        return products.filter((p) => p.gender === 'men' || p.gender === 'unisex').slice(0, 4);
      case 'women':
        return products.filter((p) => p.gender === 'women' || p.gender === 'unisex').slice(0, 4);
      case 'running':
        return products.filter((p) => p.collection_type === 'running').slice(0, 4);
      case 'sports':
        return products
          .filter((p) => p.collection_type === 'sports' || p.collection_type === 'training')
          .slice(0, 4);
    }
  }, [products, disciplineTab]);

  const salePreview = useMemo(
    () =>
      products
        .filter((p) => p.discount_price_pkr !== null && p.discount_price_pkr < p.price_pkr)
        .slice(0, 4),
    [products]
  );

  return (
    <>
      <SeoHead
        title="SOLEVERSE — Luxury & Performance Sneakers"
        description="Discover architectural luxury sneakers, carbon-plated marathon runners, and curated athletic silhouettes delivered nationwide across Pakistan with Cash on Delivery."
        canonicalPath="/"
      />

      {/* 1. CINEMATIC FLAGSHIP HERO WITH AUTOPLAY VIDEO & PARALLAX */}
      <section
        ref={heroRef}
        className="relative bg-[#101114] text-[#F5F3ED] overflow-hidden border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[600px] lg:min-h-[660px]">
          <motion.div
            style={{ opacity: heroOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 px-6 sm:px-10 lg:px-12 py-14 lg:py-20 flex flex-col justify-center z-10"
          >
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="px-2.5 py-1 bg-[#D7FF45] text-[#101114] text-[10px] font-bold uppercase tracking-[0.18em]">
                Atelier Season 2026
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-[#C5C7CB]">
                52 Curated Silhouettes
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.04] font-semibold tracking-tight text-balance mb-5">
              STEP INTO YOUR WORLD.
            </h1>

            <p className="text-base sm:text-lg text-[#C5C7CB] leading-relaxed max-w-lg mb-8">
              Discover the perfect balance of performance, comfort, and style. Hand-lasted Italian
              calfskin courts and carbon-plated runners delivered nationwide across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-7 py-4 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-[0.16em] hover:brightness-95 transition-all inline-flex items-center gap-2"
              >
                EXPLORE COLLECTION
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/collections/new-arrivals"
                className="px-7 py-4 border border-white/25 text-[#F5F3ED] text-xs font-semibold uppercase tracking-[0.16em] hover:border-[#D7FF45] hover:text-[#D7FF45] transition-colors"
              >
                SHOP NOW
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/10 text-xs">
              <div>
                <p className="font-mono text-lg font-semibold text-[#D7FF45]">52+</p>
                <p className="text-[#C5C7CB] mt-0.5">Unique Silhouettes</p>
              </div>
              <div>
                <p className="font-mono text-lg font-semibold text-white">COD</p>
                <p className="text-[#C5C7CB] mt-0.5">Nationwide Delivery</p>
              </div>
              <div>
                <p className="font-mono text-lg font-semibold text-white">14-Day</p>
                <p className="text-[#C5C7CB] mt-0.5">Size Exchange</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: heroMediaY }}
            className="lg:col-span-6 relative min-h-[360px] lg:min-h-full bg-[#202126] overflow-hidden"
          >
            {!heroVideoError ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/images/banners/hero-flagship.jpg"
                onError={() => setHeroVideoError(true)}
                className="w-full h-full object-cover object-center"
              >
                <source src="/videos/hero-campaign.mp4" type="video/mp4" />
              </video>
            ) : (
              <SafeImage
                src="/images/banners/hero-flagship.jpg"
                alt="SOLEVERSE Obsidian Reserve sneaker showcase"
                loading="eager"
                className="w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#101114] via-[#101114]/25 to-transparent lg:block hidden pointer-events-none" />
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#101114]/80 border border-white/15 backdrop-blur-xs flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#F5F3ED]">
              <Play className="w-3 h-3 text-[#D7FF45] fill-[#D7FF45]" />
              Atelier Film · Obsidian Apex
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES STRIP */}
      <section className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#C5C7CB]/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
                Curated Departments
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
                Shop by Footwear Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] hover:opacity-75 inline-flex items-center gap-1.5"
            >
              View Full Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-3 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors flex flex-col justify-between h-full"
                >
                  <div className="aspect-[4/3] bg-[#EDEAE2] dark:bg-[#101114] overflow-hidden mb-3">
                    <SafeImage
                      src={cat.image_url ?? '/images/sneakers/sv-01-obsidian-apex-low.jpg'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#101114] dark:text-[#F5F3ED] truncate">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-[#52525B] dark:text-[#C5C7CB]/70 capitalize mt-0.5">
                      {cat.parent_group}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SNEAKERS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
              Editorial Selection
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Featured Silhouettes
            </h2>
          </div>
          <Link
            to="/shop?sort=featured"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] hover:opacity-75 inline-flex items-center gap-1.5"
          >
            Browse All Featured
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {catalogLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/5] bg-[#EDEAE2] dark:bg-[#202126] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* 4. CINEMATIC VIDEO & WOMEN'S ATELIER CAMPAIGN BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 relative min-h-[400px] bg-[#101114] overflow-hidden group border border-white/10">
            {!labVideoError ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/images/banners/performance-lab.jpg"
                onError={() => setLabVideoError(true)}
                className="w-full h-full object-cover"
              >
                <source src="/videos/performance-showcase.mp4" type="video/mp4" />
              </video>
            ) : (
              <SafeImage
                src="/images/banners/performance-lab.jpg"
                alt="SOLEVERSE Running Lab Carbon Series"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-[#F5F3ED]">
              <span className="inline-block px-2.5 py-0.5 bg-[#D7FF45] text-[#101114] text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                Performance Video Showcase
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold mb-2">
                Running Lab & Carbon Racers
              </h3>
              <p className="text-sm text-[#C5C7CB] max-w-md mb-5">
                Nitrogen-infused midsoles and twin carbon rods tuned for marathon cadence.
              </p>
              <Link
                to="/collections/running"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-[0.14em] hover:brightness-95 transition-all"
              >
                Shop Running
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[400px] bg-[#202126] overflow-hidden group border border-[#C5C7CB]/40 dark:border-white/10">
            <SafeImage
              src="/images/banners/womens-atelier.jpg"
              alt="SOLEVERSE Women's Atelier Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-[#F5F3ED]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D7FF45] font-semibold mb-2">
                Minimalist Atelier
              </p>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold mb-2">
                Women&apos;s Sculptural Courts
              </h3>
              <p className="text-sm text-[#C5C7CB] mb-5">
                Pearl calfskin and champagne suede crafted for effortless poise.
              </p>
              <Link
                to="/collections/women"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#101114] text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#D7FF45] transition-colors"
              >
                Shop Women
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="bg-white dark:bg-[#202126]/60 border-y border-[#C5C7CB]/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
                Just Landed
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/collections/new-arrivals"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] hover:opacity-75 inline-flex items-center gap-1.5"
            >
              Shop New Drops
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS · TRENDING · EXCLUSIVE ATELIER SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
              Curated Edits
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Best Sellers, Trending & Reserve
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Curated sneaker edits"
            className="inline-flex items-center gap-1 p-1 bg-[#EDEAE2] dark:bg-[#202126] border border-[#C5C7CB]/50 dark:border-white/10 self-start"
          >
            {(
              [
                { key: 'bestsellers', label: 'Best Sellers' },
                { key: 'trending', label: 'Trending Now' },
                { key: 'exclusive', label: 'Exclusive Reserve' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={spotlightTab === tab.key}
                onClick={() => setSpotlightTab(tab.key)}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  spotlightTab === tab.key
                    ? 'bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                    : 'text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlightProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PROMOTIONAL ARCHIVE SALE BANNER */}
      <section className="bg-[#101114] text-[#F5F3ED] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-2.5 py-0.5 bg-[#D7FF45] text-[#101114] text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
              Seasonal Archive Event
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold mb-3">
              Up to 18% Off Selected Silhouettes · Extra 10% With Code SOLE10
            </h2>
            <p className="text-sm text-[#C5C7CB] leading-relaxed">
              Apply code <span className="font-mono text-[#D7FF45] font-semibold">SOLE10</span> at
              checkout on orders above PKR 15,000. Complimentary express delivery applies
              automatically above PKR 25,000.
            </p>
          </div>
          <Link
            to="/collections/sale"
            className="px-7 py-4 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-[0.16em] hover:brightness-95 transition-all inline-flex items-center gap-2 shrink-0"
          >
            Shop Archive Sale ({salePreview.length}+ Styles)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 8. EXPLORE BY DISCIPLINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
              Department Showcase
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Explore by Discipline
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'men', label: "Men's" },
                { key: 'women', label: "Women's" },
                { key: 'running', label: 'Running' },
                { key: 'sports', label: 'Sports' },
              ] as const
            ).map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDisciplineTab(d.key)}
                className={`px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap ${
                  disciplineTab === d.key
                    ? 'border-[#101114] dark:border-[#D7FF45] bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                    : 'border-[#C5C7CB]/60 dark:border-white/15 bg-white dark:bg-[#202126] text-[#3F3F46] dark:text-[#C5C7CB] hover:border-[#101114] dark:hover:border-white'
                }`}
              >
                {d.label}
              </button>
            ))}
            <Link
              to={`/collections/${disciplineTab}`}
              className="ml-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#101114] dark:text-[#D7FF45] hover:underline inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {disciplineProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. DESIGN HOUSES & LABELS */}
      <section className="bg-white dark:bg-[#202126]/60 border-y border-[#C5C7CB]/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
                Partner Houses
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
                Curated Design Labels
              </h2>
            </div>
            <Link
              to="/brands"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] hover:opacity-75 inline-flex items-center gap-1.5"
            >
              Explore All Brands
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {brands.map((b) => (
              <Link
                key={b.id}
                to={`/brands/${b.slug}`}
                className="p-4 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/10 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors flex flex-col justify-between gap-2"
              >
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#52525B] dark:text-[#D7FF45]">
                  {b.origin || 'Atelier'}
                </span>
                <span className="font-editorial text-base font-semibold text-[#101114] dark:text-[#F5F3ED]">
                  {b.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CRAFTSMANSHIP & GUARANTEE PILLARS */}
      <section className="bg-[#EDEAE2] dark:bg-[#18191D] border-b border-[#C5C7CB]/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <Sparkles className="w-5 h-5 text-[#101114] dark:text-[#D7FF45]" strokeWidth={1.75} />
            <h3 className="text-base font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Italian Calfskin & Carbon
            </h3>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              Full-grain drum-dyed hides paired with stitched rubber cupsoles and Pebax propulsion
              plates across our performance line.
            </p>
          </div>
          <div className="space-y-2.5">
            <Truck className="w-5 h-5 text-[#101114] dark:text-[#D7FF45]" strokeWidth={1.75} />
            <h3 className="text-base font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Nationwide Cash on Delivery
            </h3>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              Insured 2–4 day courier dispatch to Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad,
              and 90+ cities across Pakistan.
            </p>
          </div>
          <div className="space-y-2.5">
            <Shield className="w-5 h-5 text-[#101114] dark:text-[#D7FF45]" strokeWidth={1.75} />
            <h3 className="text-base font-semibold text-[#101114] dark:text-[#F5F3ED]">
              14-Day Fit Exchange
            </h3>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              Every pair undergoes 12-point inspection prior to sealing and includes complimentary
              EU size exchange within 14 days.
            </p>
          </div>
        </div>
      </section>

      {/* 11. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
            Collector Stories
          </p>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
            Verified Reviews Across Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-1 text-[#101114] dark:text-[#D7FF45] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#3F3F46] dark:text-[#C5C7CB] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <footer className="pt-4 border-t border-[#EDEAE2] dark:border-white/10">
                <p className="text-sm font-semibold text-[#101114] dark:text-[#F5F3ED]">{t.name}</p>
                <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]/70">{t.role}</p>
                <p className="text-xs text-[#101114] dark:text-[#D7FF45] mt-1 inline-flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" />
                  Verified Owner · {t.model}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
