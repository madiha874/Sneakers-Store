import { useSearchParams } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { CatalogExplorer } from '../components/product/CatalogExplorer';
import { CollectionType, ProductFilterState, SortOption } from '../types';

interface ShopPageProps {
  collectionPreset?:
    | 'all'
    | 'men'
    | 'women'
    | 'running'
    | 'sports'
    | 'new-arrivals'
    | 'best-sellers'
    | 'trending'
    | 'sale';
}

const PRESET_META: Record<
  NonNullable<ShopPageProps['collectionPreset']>,
  { title: string; subtitle: string; filters: Partial<ProductFilterState>; hideGender?: boolean }
> = {
  all: {
    title: 'All Sneakers',
    subtitle: 'Every architectural court, carbon runner, and seasonal atelier release in stock.',
    filters: {},
  },
  men: {
    title: "Men's Collection",
    subtitle: 'Full-grain calfskin low-tops, charcoal suede high-tops, and precision runners.',
    filters: { gender: 'men' },
    hideGender: true,
  },
  women: {
    title: "Women's Atelier",
    subtitle: 'Sculptural profiles in pearl leather, champagne suede, and cloud-light walking soles.',
    filters: { gender: 'women' },
    hideGender: true,
  },
  running: {
    title: 'Running Lab',
    subtitle: 'Carbon-plated marathon racers and high-mileage nitrogen-foam road trainers.',
    filters: { collectionType: 'running' },
  },
  sports: {
    title: 'Sports & Training',
    subtitle: 'Multi-surface trail traction, court containment, and grounded lifting trainers.',
    filters: { collectionType: 'sports' },
  },
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'Latest seasonal releases fresh from the SOLEVERSE Atelier.',
    filters: { isNewArrival: true, sort: 'newest' },
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Our highest-demand silhouettes favored by collectors and runners nationwide.',
    filters: { isBestseller: true, sort: 'bestselling' },
  },
  trending: {
    title: 'Trending Now',
    subtitle: 'The fastest-moving colorways and silhouettes across Lahore, Karachi, and Islamabad.',
    filters: { isTrending: true, sort: 'bestselling' },
  },
  sale: {
    title: 'Archive Sale',
    subtitle: 'Special seasonal pricing on curated court and performance releases.',
    filters: { onSaleOnly: true },
  },
};

export function ShopPage({ collectionPreset = 'all' }: ShopPageProps) {
  const [searchParams] = useSearchParams();
  const meta = PRESET_META[collectionPreset];

  const mergedFilters: Partial<ProductFilterState> = {
    ...meta.filters,
    categorySlug: searchParams.get('category') ?? meta.filters.categorySlug,
    gender: (searchParams.get('gender') as ProductFilterState['gender']) ?? meta.filters.gender,
    collectionType:
      (searchParams.get('collection') as CollectionType) ?? meta.filters.collectionType,
    brand: searchParams.get('brand') ?? meta.filters.brand,
    sort: (searchParams.get('sort') as SortOption) ?? meta.filters.sort ?? 'featured',
  };

  return (
    <>
      <SeoHead
        title={meta.title}
        description={meta.subtitle}
        canonicalPath={collectionPreset === 'all' ? '/shop' : `/collections/${collectionPreset}`}
      />
      <CatalogExplorer
        key={collectionPreset + searchParams.toString()}
        title={meta.title}
        subtitle={meta.subtitle}
        initialFilters={mergedFilters}
        hideGenderFilter={meta.hideGender}
      />
    </>
  );
}
