import { SeoHead } from '../components/common/SeoHead';
import { useStore } from '../context/StoreContext';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'returns' | 'shipping';
}

export function PolicyPage({ type }: PolicyPageProps) {
  const { siteSettings } = useStore();
  const supportEmail = siteSettings.store.support_email || 'your-business-email@gmail.com';

  const POLICIES: Record<
    PolicyPageProps['type'],
    { title: string; updated: string; sections: Array<{ heading: string; body: string }> }
  > = {
    privacy: {
      title: 'Privacy Policy',
      updated: 'November 2026',
      sections: [
        {
          heading: '1. Data We Collect',
          body: 'SOLEVERSE collects only the information necessary to fulfill your footwear orders, maintain your wishlist, and dispatch courier updates—specifically your name, email address, phone number, and shipping address.',
        },
        {
          heading: '2. Security & Row Level Isolation',
          body: 'Customer accounts are authenticated via encrypted Supabase Auth sessions. Order histories, saved addresses, and wishlists are isolated with PostgreSQL Row Level Security so only you and authorized fulfillment administrators can access your records.',
        },
        {
          heading: '3. Third-Party Sharing',
          body: 'We never sell customer data. Delivery coordinates are shared solely with our insured courier partners to complete your Cash on Delivery shipment.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      updated: 'November 2026',
      sections: [
        {
          heading: '1. Orders & Pricing',
          body: 'All prices are listed in Pakistani Rupees (PKR). Order totals, stock reservations, and promo discounts are validated server-side in PostgreSQL at the moment of checkout confirmation.',
        },
        {
          heading: '2. Cash on Delivery Verification',
          body: 'Customers agree to provide accurate telephone and street coordinates. Our dispatch team may confirm high-value COD orders via phone or WhatsApp prior to courier handoff.',
        },
        {
          heading: '3. Intellectual Property',
          body: 'All SOLEVERSE product designs, studio photography, and editorial copy remain the exclusive property of SOLEVERSE Footwear House.',
        },
      ],
    },
    returns: {
      title: 'Return & Refund Policy',
      updated: 'November 2026',
      sections: [
        {
          heading: '1. 14-Day Unworn Exchange & Return',
          body: 'We offer hassle-free size exchanges and returns within 14 days of delivery, provided sneakers remain unworn outdoors with clean outsoles, original box, and Atelier tag intact.',
        },
        {
          heading: '2. How to Initiate a Return',
          body: `Contact ${supportEmail} with your SV order number and requested replacement size. Our courier will collect the parcel directly from your address.`,
        },
        {
          heading: '3. Refunds for COD Orders',
          body: 'Approved COD returns are refunded within 3–5 business days via direct bank transfer (IBFT) or store credit according to your preference.',
        },
      ],
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      updated: 'November 2026',
      sections: [
        {
          heading: '1. Express Cash on Delivery Nationwide',
          body: `Orders placed before 4:00 PM PKT ship the same business day via insured courier. Standard arrival takes ${siteSettings.shipping.estimated_days}.`,
        },
        {
          heading: '2. Shipping Rates & Free Delivery Threshold',
          body: `Flat shipping is PKR ${siteSettings.shipping.flat_rate_pkr.toLocaleString()} nationwide. Orders of PKR ${siteSettings.shipping.free_threshold_pkr.toLocaleString()} or above automatically receive complimentary express shipping.`,
        },
        {
          heading: '3. Tamper-Sealed Packaging & Tracking',
          body: 'Every sneaker pair is double-boxed in rigid protective kraft board with a tamper-evident Atelier seal. Tracking notifications are accessible under My Orders.',
        },
      ],
    },
  };

  const doc = POLICIES[type];

  return (
    <>
      <SeoHead
        title={doc.title}
        description={`SOLEVERSE ${doc.title}`}
        canonicalPath={type === 'shipping' ? '/shipping-policy' : undefined}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
          Legal & Care · Updated {doc.updated}
        </p>
        <h1 className="font-editorial text-4xl font-semibold text-[#101114] dark:text-[#F5F3ED] mb-10">
          {doc.title}
        </h1>

        <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-8 space-y-8">
          {doc.sections.map((sec) => (
            <section key={sec.heading} className="space-y-2">
              <h2 className="font-editorial text-xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
                {sec.heading}
              </h2>
              <p className="text-sm text-[#3F3F46] dark:text-[#C5C7CB] leading-relaxed">
                {sec.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
