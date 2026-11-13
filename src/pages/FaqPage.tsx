import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';

const FAQS = [
  {
    q: 'How does Cash on Delivery (COD) work across Pakistan?',
    a: 'Select Cash on Delivery at checkout and pay the exact PKR order total to the courier upon doorstep arrival. Express delivery takes 2–4 business days across major cities and is complimentary on orders above PKR 25,000.',
  },
  {
    q: 'How do SOLEVERSE European (EU) sizes run?',
    a: 'Our court and minimalist silhouettes follow standard European sizing (EU 37–45). If you sit between half sizes in performance running models, we recommend choosing the next size up for marathon toe-box clearance.',
  },
  {
    q: 'Can I exchange a pair if the size does not fit?',
    a: 'Yes. Unworn pairs in original packaging with intact dust bags and seals qualify for complimentary size exchange or full refund within 14 days of delivery.',
  },
  {
    q: 'Are promo codes valid on discounted sneakers?',
    a: 'Yes, active promo codes such as SOLE10 apply at checkout whenever your bag subtotal meets the minimum order threshold.',
  },
  {
    q: 'How do I track an order I placed?',
    a: 'Sign in to your SOLEVERSE account and visit My Orders to view live fulfillment progress from Pending through Confirmed, Processing, Shipped, and Delivered.',
  },
];

export function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <SeoHead
        title="Frequently Asked Questions"
        description="Answers on SOLEVERSE sizing, COD delivery, and exchanges."
        canonicalPath="/faq"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
          Client Knowledge Base
        </p>
        <h1 className="font-editorial text-4xl font-semibold mb-10">
          Frequently Asked Questions
        </h1>

        <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 divide-y divide-[#EDEAE2] dark:divide-white/10">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#F5F3ED] dark:hover:bg-white/5"
                >
                  <span className="font-semibold text-base">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
