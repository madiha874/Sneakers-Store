import { useEffect } from 'react';
import { Product } from '../../types';
import { getEffectivePrice, getPrimaryImage, getTotalStock } from '../../utils/format';

interface SeoHeadProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  product?: Product | null;
}

export function SeoHead({ title, description, canonicalPath, product }: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes('SOLEVERSE') ? title : `${title} — SOLEVERSE`;
    document.title = fullTitle;

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', fullTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', fullTitle);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);
    }

    if (canonicalPath && typeof window !== 'undefined') {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = `${window.location.origin}${canonicalPath}`;
    }
  }, [title, description, canonicalPath]);

  useEffect(() => {
    const scriptId = 'soleverse-product-jsonld';
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    if (!product || typeof window === 'undefined') return;

    const totalStock = getTotalStock(product);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.sku,
      image: [`${window.location.origin}${getPrimaryImage(product)}`],
      description: product.short_description || product.description,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        url: `${window.location.origin}/product/${product.slug}`,
        priceCurrency: 'PKR',
        price: getEffectivePrice(product),
        availability:
          totalStock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      aggregateRating:
        product.review_count > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating_avg.toFixed(1),
              reviewCount: product.review_count,
            }
          : undefined,
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [product]);

  return null;
}
