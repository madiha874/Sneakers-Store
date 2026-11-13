import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';

export function ToastStack() {
  const { toasts, dismissToast } = useStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-[#101114] dark:bg-[#202126] text-[#F5F3ED] px-4 py-3 shadow-2xl border border-white/15"
          >
            <div className="flex items-center gap-2.5 text-sm">
              {toast.tone === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-[#D7FF45] shrink-0" />
              )}
              {toast.tone === 'error' && (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              {toast.tone === 'info' && (
                <Info className="w-4 h-4 text-[#C5C7CB] shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#C5C7CB] hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
