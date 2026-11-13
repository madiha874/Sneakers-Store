import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { fetchPaginatedProducts } from '../../services/catalogService';
import { CollectionType, Product, ProductFilterState, SortOption } from '../../types';
import { ProductCard } from './ProductCard';

interface CatalogExplorerProps {
  title: string;
  subtitle: string;
  initialFilters?: Partial<ProductFilterState>;
  hideGenderFilter?: boolean;
}

const EU_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];
const PAGE_SIZE = 12;

const COLOR_FAMILIES = [
  { label: 'Black / Obsidian', query: 'black', hex: '#101114' },
  { label: 'Obsidian / Onyx', query: 'obsidian', hex: '#202126' },
  { label: 'White / Ivory / Bone', query: 'ivory', hex: '#F5F3ED' },
  { label: 'Sienna / Copper / Rust', query: 'sienna', hex: '#9A3412' },
  { label: 'Pine / Olive / Moss', query: 'pine', hex: '#14532D' },
  { label: 'Cobalt / Navy / Indigo', query: 'cobalt', hex: '#1E3A8A' },
  { label: 'Silver / Platinum / Slate', query: 'silver', hex: '#C5C7CB' },
  { label: 'Sand / Champagne / Taupe', query: 'sand', hex: '#C29B61' },
  { label: 'Oxblood / Crimson / Garnet', query: 'oxblood', hex: '#7F1D1D' },
];

export function CatalogExplorer({
  title,
  subtitle,
  initialFilters = {},
  hideGenderFilter = false,
}: CatalogExplorerProps) {
  const { categories, brands: storeBrands, catalogLoading } = useStore();

  const [search, setSearch] = useState(initialFilters.search ?? '');
  const [categorySlug, setCategorySlug] = useState(initialFilters.categorySlug ?? '');
  const [gender, setGender] = useState<'' | 'men' | 'women' | 'unisex'>(
    initialFilters.gender ?? ''
  );
  const [collectionType, setCollectionType] = useState<CollectionType | ''>(
    initialFilters.collectionType ?? ''
  );
  const [brand, setBrand] = useState(initialFilters.brand ?? '');
  const [sizeEu, setSizeEu] = useState(initialFilters.sizeEu ?? '');
  const [colorName, setColorName] = useState(initialFilters.colorName ?? '');
  const [priceBracket, setPriceBracket] = useState<'all' | 'under25' | '25to32' | 'above32'>('all');
  const [inStockOnly, setInStockOnly] = useState(Boolean(initialFilters.inStockOnly));
  const [onSaleOnly, setOnSaleOnly] = useState(Boolean(initialFilters.onSaleOnly));
  const [minRating, setMinRating] = useState<number>(initialFilters.minRating ?? 0);
  const [sort, setSort] = useState<SortOption>(initialFilters.sort ?? 'featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchingPage, setFetchingPage] = useState(true);

  const activeFilterPayload = useMemo<Partial<ProductFilterState>>(() => {
    const minPrice =
      priceBracket === '25to32' ? 25000 : priceBracket === 'above32' ? 32001 : undefined;
    const maxPrice =
      priceBracket === 'under25' ? 24999 : priceBracket === '25to32' ? 32000 : undefined;

    return {
      ...initialFilters,
      search,
      categorySlug: categorySlug || undefined,
      gender: gender || initialFilters.gender,
      collectionType: collectionType || initialFilters.collectionType,
      brand: brand || undefined,
      sizeEu: sizeEu || undefined,
      colorName: colorName || undefined,
      minPrice,
      maxPrice,
      inStockOnly,
      onSaleOnly: onSaleOnly || initialFilters.onSaleOnly,
      minRating: minRating || undefined,
      sort,
    };
  }, [
    initialFilters,
    search,
    categorySlug,
    gender,
    collectionType,
    brand,
    sizeEu,
    colorName,
    priceBracket,
    inStockOnly,
    onSaleOnly,
    minRating,
    sort,
  ]);

  useEffect(() => {
    let active = true;
    setFetchingPage(true);

    fetchPaginatedProducts(activeFilterPayload, page, PAGE_SIZE)
      .then((res) => {
        if (!active) return;
        setPaginatedProducts(res.products);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        if (active) setPaginatedProducts([]);
      })
      .finally(() => {
        if (active) setFetchingPage(false);
      });

    return () => {
      active = false;
    };
  }, [activeFilterPayload, page]);

  const resetFilters = () => {
    setSearch('');
    setCategorySlug('');
    setGender(initialFilters.gender ?? '');
    setCollectionType(initialFilters.collectionType ?? '');
    setBrand(initialFilters.brand ?? '');
    setSizeEu('');
    setColorName('');
    setPriceBracket('all');
    setInStockOnly(false);
    setOnSaleOnly(Boolean(initialFilters.onSaleOnly));
    setMinRating(0);
    setSort(initialFilters.sort ?? 'featured');
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(categorySlug) ||
    (!hideGenderFilter && Boolean(gender)) ||
    Boolean(collectionType && !initialFilters.collectionType) ||
    Boolean(brand && !initialFilters.brand) ||
    Boolean(sizeEu) ||
    Boolean(colorName) ||
    priceBracket !== 'all' ||
    inStockOnly ||
    (onSaleOnly && !initialFilters.onSaleOnly) ||
    minRating > 0;

  const brandNames = useMemo(
    () => storeBrands.map((b) => b.name).sort(),
    [storeBrands]
  );

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2">
          Search Catalog
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#71717A] dark:text-[#C5C7CB] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Model, brand, SKU..."
            className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2.5">
          Category
        </h3>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setCategorySlug('');
              setPage(1);
            }}
            className={`block w-full text-left text-sm py-1 transition-colors ${
              categorySlug === ''
                ? 'font-semibold text-[#101114] dark:text-[#D7FF45] underline underline-offset-4'
                : 'text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategorySlug(cat.slug);
                setPage(1);
              }}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                categorySlug === cat.slug
                  ? 'font-semibold text-[#101114] dark:text-[#D7FF45] underline underline-offset-4'
                  : 'text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      {!hideGenderFilter && (
        <div>
          <h3 className="text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2.5">
            Department
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { value: '', label: 'All' },
              { value: 'men', label: 'Men' },
              { value: 'women', label: 'Women' },
            ].map((g) => (
              <button
                key={g.label}
                type="button"
                onClick={() => {
                  setGender(g.value as '' | 'men' | 'women');
                  setPage(1);
                }}
                className={`py-2 text-xs font-semibold border transition-colors ${
                  gender === g.value
                    ? 'border-[#101114] dark:border-[#D7FF45] bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                    : 'border-[#C5C7CB]/60 dark:border-white/10 bg-white dark:bg-[#202126] text-[#3F3F46] dark:text-[#C5C7CB] hover:border-[#101114] dark:hover:border-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      <div>
        <label className="block text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2">
          House / Brand
        </label>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2.5 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]"
        >
          <option value="">All Brands</option>
          {brandNames.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2.5">
          Price Range (PKR)
        </h3>
        <div className="space-y-1.5">
          {[
            { value: 'all', label: 'All Prices' },
            { value: 'under25', label: 'Under PKR 25,000' },
            { value: '25to32', label: 'PKR 25,000 – 32,000' },
            { value: 'above32', label: 'PKR 32,000+' },
          ].map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => {
                setPriceBracket(p.value as typeof priceBracket);
                setPage(1);
              }}
              className={`block w-full text-left text-sm py-1 ${
                priceBracket === p.value
                  ? 'font-semibold text-[#101114] dark:text-[#D7FF45] underline underline-offset-4'
                  : 'text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shoe Size EU */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2.5">
          Shoe Size (EU)
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {EU_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSizeEu((prev) => (prev === s ? '' : s));
                setPage(1);
              }}
              className={`py-2 font-mono text-xs font-semibold border transition-colors ${
                sizeEu === s
                  ? 'border-[#101114] dark:border-[#D7FF45] bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                  : 'border-[#C5C7CB]/60 dark:border-white/10 bg-white dark:bg-[#202126] text-[#3F3F46] dark:text-[#C5C7CB] hover:border-[#101114] dark:hover:border-white'
              }`}
            >
              EU {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colorway */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-2.5">
          Colorway
        </h3>
        <div className="flex flex-wrap gap-2">
          {COLOR_FAMILIES.map((col) => {
            const active = colorName === col.query;
            return (
              <button
                key={col.query}
                type="button"
                title={col.label}
                onClick={() => {
                  setColorName((prev) => (prev === col.query ? '' : col.query));
                  setPage(1);
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  active
                    ? 'border-[#101114] dark:border-[#D7FF45] scale-110 ring-2 ring-[#D7FF45]/50'
                    : 'border-black/20 dark:border-white/25 hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                aria-label={`Filter by ${col.label}`}
              />
            );
          })}
        </div>
      </div>

      {/* Availability & Rating */}
      <div className="space-y-3 pt-2 border-t border-[#C5C7CB]/50 dark:border-white/10">
        <label className="flex items-center gap-2.5 text-sm text-[#101114] dark:text-[#F5F3ED] cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setPage(1);
            }}
            className="w-4 h-4 accent-[#101114] dark:accent-[#D7FF45]"
          />
          In Stock Only
        </label>
        <label className="flex items-center gap-2.5 text-sm text-[#101114] dark:text-[#F5F3ED] cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => {
              setOnSaleOnly(e.target.checked);
              setPage(1);
            }}
            className="w-4 h-4 accent-[#101114] dark:accent-[#D7FF45]"
          />
          Discounted / Sale Only
        </label>
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#52525B] dark:text-[#C5C7CB] font-semibold mb-1.5">
            Minimum Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(Number(e.target.value));
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none"
          >
            <option value={0}>Any Rating</option>
            <option value={4.8}>4.8★ & Above</option>
            <option value={4.9}>4.9★ & Above</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full py-2.5 border border-[#101114] dark:border-[#D7FF45] text-xs font-semibold uppercase tracking-[0.12em] text-[#101114] dark:text-[#D7FF45] hover:bg-[#101114] hover:text-white dark:hover:bg-[#D7FF45] dark:hover:text-[#101114] transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="pb-8 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] dark:text-[#C5C7CB] mt-2 max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-[#101114] dark:text-[#F5F3ED]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-xs text-[#52525B] dark:text-[#C5C7CB] hidden sm:inline"
            >
              Sort:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOption);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 text-xs font-medium text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="bestselling">Best Selling</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split: Sidebar + Server-Paginated Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3 pr-2">{FilterPanel}</aside>

        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-5 text-xs text-[#52525B] dark:text-[#C5C7CB]">
            <span className="font-mono tabular-nums">
              Page {page} of {totalPages} · Showing {paginatedProducts.length} of {totalCount}{' '}
              sneaker{totalCount === 1 ? '' : 's'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[#101114] dark:text-[#D7FF45] font-semibold hover:underline"
              >
                Clear Active Filters
              </button>
            )}
          </div>

          {catalogLoading || fetchingPage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="aspect-[4/5] bg-[#EDEAE2] dark:bg-[#202126] animate-pulse"
                />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-12 text-center">
              <p className="font-editorial text-2xl text-[#101114] dark:text-[#F5F3ED] mb-2">
                No matching sneakers found
              </p>
              <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] max-w-md mx-auto mb-6">
                No silhouettes matched your active filter combination. Try clearing a size, color, or
                price constraint.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginated Bar */}
              {totalPages > 1 && (
                <nav
                  aria-label="Catalog pagination"
                  className="mt-12 pt-6 border-t border-[#C5C7CB]/50 dark:border-white/10 flex flex-wrap items-center justify-between gap-4"
                >
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#C5C7CB]/60 dark:border-white/15 text-xs font-semibold uppercase tracking-[0.12em] disabled:opacity-35 hover:border-[#101114] dark:hover:border-[#D7FF45]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 font-mono text-xs font-semibold border transition-colors ${
                          page === pageNum
                            ? 'bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] border-[#101114] dark:border-[#D7FF45]'
                            : 'bg-white dark:bg-[#202126] border-[#C5C7CB]/60 dark:border-white/15 text-[#101114] dark:text-[#F5F3ED] hover:border-[#101114] dark:hover:border-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#C5C7CB]/60 dark:border-white/15 text-xs font-semibold uppercase tracking-[0.12em] disabled:opacity-35 hover:border-[#101114] dark:hover:border-[#D7FF45]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-80 max-w-[85vw] bg-[#F5F3ED] dark:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] h-full overflow-y-auto p-6 shadow-2xl border-r border-[#C5C7CB]/60 dark:border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-5">
              <h2 className="font-editorial text-lg font-semibold">Refine Collection</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
