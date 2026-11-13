import { Link } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';

export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About SOLEVERSE"
        description="The story, craftsmanship, and architectural philosophy behind SOLEVERSE."
        canonicalPath="/about"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#52525B] dark:text-[#D7FF45] font-semibold">
              Our House Philosophy
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
              Precision Footwear Built Without Visual Noise.
            </h1>
            <p className="text-base text-[#3F3F46] dark:text-[#C5C7CB] leading-relaxed">
              Founded to elevate sneaker culture in Pakistan, SOLEVERSE brings together Italian
              full-grain calfskin craftsmanship and modern biomechanical running engineering under
              one curated roof.
            </p>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]/80 leading-relaxed">
              Every silhouette in our 52-piece seasonal collection is vetted for hide suppleness,
              midsole energy return, and stitched cupsole longevity—then dispatched nationwide with
              transparent Cash on Delivery.
            </p>
          </div>
          <div className="lg:col-span-6 aspect-[4/3] bg-[#EDEAE2] dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 overflow-hidden">
            <SafeImage
              src="/images/banners/womens-atelier.jpg"
              alt="SOLEVERSE Footwear Atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#C5C7CB]/60 dark:border-white/10">
          <div>
            <h2 className="font-editorial text-xl font-semibold mb-2">01. Honest Materials</h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              Drum-dyed hides, vegetable-tanned linings, and supercritical Pebax foams—never cheap
              synthetic shortcuts.
            </p>
          </div>
          <div>
            <h2 className="font-editorial text-xl font-semibold mb-2">02. Verified Fit</h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              Consistent European last sizing from EU 37 through EU 45, backed by our 14-day unworn
              size exchange guarantee.
            </p>
          </div>
          <div>
            <h2 className="font-editorial text-xl font-semibold mb-2">03. Nationwide Reach</h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              Insured Cash on Delivery couriers reaching Karachi, Lahore, Islamabad, and 90+ cities
              in 2–4 business days.
            </p>
          </div>
        </div>

        <div className="bg-[#101114] dark:bg-[#202126] text-[#F5F3ED] border border-white/10 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-editorial text-2xl font-semibold">Ready to find your pair?</h2>
            <p className="text-sm text-[#C5C7CB] mt-1">
              Explore men&apos;s, women&apos;s, and carbon-plated running footwear.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3.5 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-[0.14em] hover:brightness-95 transition-all"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </>
  );
}
