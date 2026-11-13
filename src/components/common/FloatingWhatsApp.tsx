import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function FloatingWhatsApp() {
  const { siteSettings } = useStore();
  const digits = (siteSettings.store.whatsapp_number || '923000000000').replace(/\D/g, '');
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    'Hello SOLEVERSE Concierge — I would like sizing or order assistance.'
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SOLEVERSE Concierge on WhatsApp"
      title="WhatsApp Sneaker Concierge"
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-4 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] border border-white/15 dark:border-[#101114] shadow-xl hover:-translate-y-0.5 transition-all text-xs font-semibold uppercase tracking-[0.12em]"
    >
      <MessageCircle className="w-4 h-4 text-[#D7FF45] dark:text-[#101114]" strokeWidth={2} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
