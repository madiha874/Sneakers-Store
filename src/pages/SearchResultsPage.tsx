import { useSearchParams } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { CatalogExplorer } from '../components/product/CatalogExplorer';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  return (
    <>
      <SeoHead
        title={q ? `Search: ${q}` : 'Search Sneakers'}
        description={`Search results for ${q || 'sneakers'} at SOLEVERSE.`}
      />
      <CatalogExplorer
        key={q}
        title={q ? `Results for "${q}"` : 'Search Catalog'}
        subtitle="Explore matching silhouettes by model name, brand house, SKU, or discipline."
        initialFilters={{ search: q }}
      />
    </>
  );
}
