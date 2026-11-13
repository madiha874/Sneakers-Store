import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export function Footer() {
  const { siteSettings, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast('Welcome to the SOLEVERSE Private Dispatch.', 'success');
  };

  const whatsappDigits = (siteSettings.store.whatsapp_number || '923000000000').replace(/\D/g, '');

  return (
    <footer className="bg-[#101114] text-[#F5F3ED] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="font-editorial text-2xl font-semibold tracking-[0.16em] text-white inline-block"
              >
                SOLEVERSE
              </Link>
              <span className="px-2 py-0.5 bg-[#D7FF45] text-[#101114] text-[10px] font-bold uppercase tracking-[0.14em]">
                Atelier
              </span>
            </div>
            <p className="text-sm text-[#C5C7CB] leading-relaxed max-w-md">
              An architectural footwear house dedicated to precision craftsmanship, Italian full-grain
              materials, and carbon-plated running engineering. Delivered nationwide across Pakistan
              with Cash on Delivery.
            </p>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[#C5C7CB]/70 mb-3">
                Private Release Dispatch
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 text-sm text-[#D7FF45]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are registered for early Atelier & limited drop access.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early release access"
                    aria-label="Newsletter email address"
                    className="flex-1 bg-[#202126] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-[#C5C7CB]/50 focus:outline-none focus:border-[#D7FF45]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#D7FF45] hover:brightness-95 text-[#101114] text-xs font-bold uppercase tracking-[0.14em] transition-all inline-flex items-center gap-1.5 shrink-0"
                  >
                    Join
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.16em] text-[#C5C7CB]/60 font-medium mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-[#C5C7CB]">
              <li><Link to="/shop" className="hover:text-[#D7FF45] transition-colors">Shop All</Link></li>
              <li><Link to="/collections/men" className="hover:text-[#D7FF45] transition-colors">Men</Link></li>
              <li><Link to="/collections/women" className="hover:text-[#D7FF45] transition-colors">Women</Link></li>
              <li><Link to="/collections/running" className="hover:text-[#D7FF45] transition-colors">Running</Link></li>
              <li><Link to="/collections/sports" className="hover:text-[#D7FF45] transition-colors">Sports & Training</Link></li>
              <li><Link to="/collections/trending" className="hover:text-[#D7FF45] transition-colors">Trending Now</Link></li>
              <li><Link to="/brands" className="hover:text-[#D7FF45] transition-colors">Designer Brands</Link></li>
              <li><Link to="/collections/sale" className="hover:text-[#D7FF45] transition-colors">Archive Sale</Link></li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.16em] text-[#C5C7CB]/60 font-medium mb-4">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#C5C7CB]">
              <li><Link to="/about" className="hover:text-[#D7FF45] transition-colors">About SOLEVERSE</Link></li>
              <li><Link to="/contact" className="hover:text-[#D7FF45] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#D7FF45] transition-colors">FAQ & Sizing</Link></li>
              <li><Link to="/compare" className="hover:text-[#D7FF45] transition-colors">Compare Sneakers</Link></li>
              <li><Link to="/account" className="hover:text-[#D7FF45] transition-colors">My Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-[#D7FF45] transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#D7FF45] transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Policies & Concierge */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.16em] text-[#C5C7CB]/60 font-medium">
              Policies & Concierge
            </h3>
            <ul className="space-y-2.5 text-sm text-[#C5C7CB]">
              <li><Link to="/shipping-policy" className="hover:text-[#D7FF45] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-[#D7FF45] transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#D7FF45] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#D7FF45] transition-colors">Terms & Conditions</Link></li>
            </ul>
            <div className="pt-3 border-t border-white/10 text-xs text-[#C5C7CB] space-y-2">
              <p className="text-white font-medium">{siteSettings.store.flagship_city}</p>
              <a
                href={`mailto:${siteSettings.store.support_email}`}
                className="flex items-center gap-2 hover:text-[#D7FF45] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D7FF45]" />
                <span>{siteSettings.store.support_email}</span>
              </a>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono hover:text-[#D7FF45] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#D7FF45]" />
                <span>WhatsApp: {siteSettings.store.support_phone}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C5C7CB]/70">
          <p>© {new Date().getFullYear()} SOLEVERSE Footwear House. All rights reserved.</p>
          <p>Cash on Delivery Nationwide · 14-Day Inspection & Exchange</p>
        </div>
      </div>
    </footer>
  );
}
