import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { useStore } from '../context/StoreContext';

export function ContactPage() {
  const { siteSettings, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const whatsappDigits = (siteSettings.store.whatsapp_number || '923000000000').replace(/\D/g, '');
  const supportEmail = siteSettings.store.support_email || 'your-business-email@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) {
      showToast('Please complete all required inquiry fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your concierge inquiry has been logged.', 'success');
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]';

  return (
    <>
      <SeoHead
        title="Contact Us"
        description="Reach the SOLEVERSE concierge team via Gmail or WhatsApp for sizing, orders, and boutique inquiries."
        canonicalPath="/contact"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
            Client Concierge
          </p>
          <h1 className="font-editorial text-4xl font-semibold">Contact Us</h1>
          <p className="text-sm sm:text-base text-[#52525B] dark:text-[#C5C7CB] mt-2">
            Questions on EU sizing, courier tracking, or Atelier Reserve availability? Reach us via
            Gmail or WhatsApp — specialists respond within 4 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#101114] dark:text-[#D7FF45] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                    Gmail Concierge
                  </p>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-sm font-medium mt-0.5 block hover:underline dark:hover:text-[#D7FF45]"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#101114] dark:text-[#D7FF45] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                    Telephone & WhatsApp Desk
                  </p>
                  <p className="text-sm font-mono font-medium mt-0.5">
                    {siteSettings.store.support_phone}
                  </p>
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-[0.12em] hover:brightness-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#101114] dark:text-[#D7FF45] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] font-semibold">
                    Showrooms & Dispatch Hubs
                  </p>
                  <p className="text-sm text-[#3F3F46] dark:text-[#C5C7CB] mt-0.5">
                    Gulberg III, Lahore · Clifton Block 4, Karachi · F-6 Markaz, Islamabad
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-[#D7FF45] mx-auto" />
                <h2 className="font-editorial text-2xl font-semibold">Inquiry Received</h2>
                <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] max-w-md mx-auto">
                  Thank you, {name}. Our client concierge will reply to {email} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Subject / Order Reference
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Sizing query for Obsidian Apex Low"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.16em] hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
