import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { SeoHead } from '../components/common/SeoHead';
import { useStore } from '../context/StoreContext';
import { formatPKR, getEffectivePrice, getPrimaryImage, getTotalStock } from '../utils/format';

export function WishlistPage() {
  const { wishlistProducts, toggleWishlist, addToCart } = useStore();

  const handleMoveToCart = async (product: (typeof wishlistProducts)[number]) => {
    const firstAvailable = product.variants.find((v) => v.is_active && v.stock_quantity > 0);
    if (!firstAvailable) return;
    const ok = await addToCart(product, firstAvailable, 1);
    if (ok) {
      await toggleWishlist(product);
    }
  };

  return (
    <>
      <SeoHead
        title="Saved Wishlist"
        description="Your curated SOLEVERSE sneaker wishlist."
        canonicalPath="/wishlist"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="pb-6 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-8">
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold">
            Saved Wishlist ({wishlistProducts.length})
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mt-1">
            Silhouettes saved for future acquisition. Signed-in accounts sync automatically across
            devices.
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-12 text-center">
            <Heart
              className="w-10 h-10 text-[#C5C7CB] dark:text-white/30 mx-auto mb-3"
              strokeWidth={1.25}
            />
            <h2 className="font-editorial text-2xl font-semibold mb-2">
              No saved silhouettes yet
            </h2>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] max-w-md mx-auto mb-6">
              Tap the heart icon on any sneaker card to curate your personal collection.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.14em]"
            >
              Explore Sneakers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => {
              const totalStock = getTotalStock(product);
              const price = getEffectivePrice(product);
              return (
                <article
                  key={product.id}
                  className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block aspect-[4/3] bg-[#EDEAE2] dark:bg-[#101114] overflow-hidden"
                    >
                      <SafeImage
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="p-4">
                      <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                        {product.brand} · {totalStock > 0 ? `${totalStock} In Stock` : 'Out of Stock'}
                      </p>
                      <Link
                        to={`/product/${product.slug}`}
                        className="block text-base font-semibold mt-1 hover:opacity-75"
                      >
                        {product.name}
                      </Link>
                      <p className="font-mono tabular-nums text-sm font-semibold mt-2 dark:text-[#D7FF45]">
                        {formatPKR(price)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={totalStock === 0}
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] hover:opacity-90 disabled:opacity-40 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Move to Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={`Remove ${product.name}`}
                      className="p-2.5 border border-[#C5C7CB]/60 dark:border-white/15 hover:border-red-500 text-[#52525B] dark:text-[#C5C7CB] hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
