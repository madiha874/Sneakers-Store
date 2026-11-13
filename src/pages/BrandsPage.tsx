import { ArrowRight, Layers } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { CatalogExplorer } from '../components/product/CatalogExplorer';
import { useStore } from '../context/StoreContext';
import { getPrimaryImage } from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';

export function BrandsPage() {
  const { brandSlug } = useParams<{ brandSlug?: string }>();
  const { brands, products } = useStore();

  if (brandSlug) {
    const selectedBrand = brands.find(
      (b) => b.slug === brandSlug || b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug
    );
    const brandName = selectedBrand?.name ?? brandSlug.replace(/-/g, ' ');
    const subtitle =
      selectedBrand?.description ??
      `Explore all curated sneaker silhouettes designed by ${brandName}.`;

    return (
      <>
        <SeoHead
          title={`${brandName} Sneakers`}
          description={subtitle}
          canonicalPath={`/brands/${brandSlug}`}
        />
        <div className="bg-[#EDEAE2] dark:bg-[#18191D] border-b border-[#C5C7CB]/60 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-xs">
            <Link
              to="/brands"
              className="uppercase tracking-[0.14em] font-semibold text-[#101114] dark:text-[#D7FF45] hover:underline"
            >
              ← All Design Houses
            </Link>
            <span className="text-[#52525B] dark:text-[#C5C7CB]">
              {selectedBrand?.origin ?? 'Curated Label'}
            </span>
          </div>
        </div>
        <CatalogExplorer
          key={brandSlug}
          title={brandName}
          subtitle={subtitle}
          initialFilters={{ brand: selectedBrand?.name ?? brandName }}
        />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title="Brands & Design Houses"
        description="Explore all 7 architectural footwear houses curated at SOLEVERSE."
        canonicalPath="/brands"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="pb-8 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1.5">
              Design Houses
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
              Curated Sneaker Brands
            </h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mt-2 max-w-2xl">
              Discover the independent ateliers, carbon-running laboratories, and heritage court
              houses represented at SOLEVERSE.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] inline-flex items-center gap-1.5"
          >
            Browse Full Catalog
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const brandProds = products.filter(
              (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
            );
            const heroProd = brandProds[0];

            return (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="group bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="aspect-[16/10] bg-[#EDEAE2] dark:bg-[#101114] overflow-hidden relative">
                  {heroProd ? (
                    <SafeImage
                      src={getPrimaryImage(heroProd)}
                      alt={`${brand.name} signature silhouette`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-8 h-8 text-[#C5C7CB]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#101114]/90 dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-[10px] font-bold uppercase tracking-[0.14em]">
                    {brand.origin || 'Atelier'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h2 className="font-editorial text-2xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
                        {brand.name}
                      </h2>
                      <span className="font-mono text-xs text-[#52525B] dark:text-[#C5C7CB]">
                        {brandProds.length} models
                      </span>
                    </div>
                    <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
                      {brand.description}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#101114] dark:text-[#D7FF45] group-hover:translate-x-1 transition-transform">
                    Explore {brand.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
