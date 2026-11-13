import { AlertTriangle, Database } from 'lucide-react';
import { isSupabaseConfigured, supabaseConfigError } from '../../lib/supabase';

interface SupabaseNoticeBannerProps {
  context?: 'storefront' | 'checkout' | 'auth' | 'admin';
}

export function SupabaseNoticeBanner({ context = 'storefront' }: SupabaseNoticeBannerProps) {
  if (isSupabaseConfigured) return null;

  const isBlocking = context === 'checkout' || context === 'auth' || context === 'admin';

  return (
    <div
      role="alert"
      className={`border-b ${
        isBlocking
          ? 'bg-amber-50 dark:bg-[#202126] border-amber-400/50 dark:border-[#D7FF45]/40 text-amber-950 dark:text-[#F5F3ED] p-5'
          : 'bg-[#EDEAE2] dark:bg-[#18191D] border-[#C5C7CB]/60 dark:border-white/10 text-[#3F3F46] dark:text-[#C5C7CB] px-4 py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          {isBlocking ? (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-700 dark:text-[#D7FF45]" />
          ) : (
            <Database className="w-4 h-4 shrink-0 mt-0.5 text-[#101114] dark:text-[#D7FF45]" />
          )}
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold text-[#101114] dark:text-[#F5F3ED]">
              {isBlocking
                ? 'Supabase Database Configuration Required: '
                : 'Catalog Preview Mode: '}
            </span>
            {isBlocking ? (
              <span>
                {supabaseConfigError} Configure{' '}
                <code className="font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5">
                  VITE_SUPABASE_URL
                </code>{' '}
                and{' '}
                <code className="font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5">
                  VITE_SUPABASE_ANON_KEY
                </code>{' '}
                in your environment and run{' '}
                <code className="font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5">
                  supabase/schema.sql
                </code>{' '}
                to enable live authentication, order persistence, and admin operations.
              </span>
            ) : (
              <span>
                Live Supabase environment variables are not set yet. Browsing the 52-sneaker catalog
                preview; set{' '}
                <code className="font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5">
                  VITE_SUPABASE_URL
                </code>{' '}
                and{' '}
                <code className="font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5">
                  VITE_SUPABASE_ANON_KEY
                </code>{' '}
                to connect live PostgreSQL orders & accounts.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
