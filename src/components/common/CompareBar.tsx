import { ArrowRight, GitCompareArrows, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { getPrimaryImage } from '../../utils/format';
import { SafeImage } from './SafeImage';

export function CompareBar() {
  const { compareProducts, toggleCompare, clearCompare } = useStore();

  return (
    <AnimatePresence>
      {compareProducts.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-20 left-5 z-40 bg-white dark:bg-[#202126] border border-[#101114] dark:border-[#D7FF45]/60 shadow-2xl p-3 flex items-center gap-3 max-w-[calc(100vw-2.5rem)]"
        >
          <div className="flex items-center gap-2 pr-1">
            <GitCompareArrows className="w-4 h-4 text-[#101114] dark:text-[#D7FF45] shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#101114] dark:text-[#F5F3ED] whitespace-nowrap">
              Compare ({compareProducts.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {compareProducts.map((p) => (
              <div key={p.id} className="relative group">
                <SafeImage
                  src={getPrimaryImage(p)}
                  alt={p.name}
                  className="w-10 h-8 object-cover border border-[#C5C7CB]/60 dark:border-white/15 bg-[#F5F3ED] dark:bg-[#101114]"
                />
                <button
                  type="button"
                  onClick={() => toggleCompare(p)}
                  aria-label={`Remove ${p.name} from compare`}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#101114] dark:bg-[#D7FF45] text-white dark:text-[#101114] flex items-center justify-center rounded-full text-[10px]"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          <Link
            to="/compare"
            className="px-3 py-1.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-[0.1em] inline-flex items-center gap-1 whitespace-nowrap hover:opacity-90"
          >
            View
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={clearCompare}
            aria-label="Clear comparison"
            className="text-xs text-[#52525B] dark:text-[#C5C7CB] hover:text-[#101114] dark:hover:text-white px-1"
          >
            Clear
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
