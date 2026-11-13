import React, { useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { SupabaseNoticeBanner } from '../components/common/SupabaseNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isConfigured } = useAuth();
  const { showToast } = useStore();

  const from = (location.state as { from?: string } | null)?.from ?? '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isConfigured) {
      setError('Supabase environment variables must be configured before signing in.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      showToast('Welcome back to SOLEVERSE.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]';

  return (
    <>
      <SeoHead title="Sign In" description="Sign in to your SOLEVERSE account." canonicalPath="/login" />

      <div className="max-w-lg mx-auto px-4 py-14 sm:py-20 space-y-6">
        <SupabaseNoticeBanner context="auth" />

        <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-8 sm:p-10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Client Portal
            </p>
            <h1 className="font-editorial text-3xl font-semibold">Sign In</h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mt-1">
              Access your saved addresses, wishlist, and real-time order tracking.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 dark:bg-red-950/50 border border-red-400/50 text-red-900 dark:text-red-200 p-3.5 text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#101114] dark:text-[#D7FF45] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] hover:opacity-90 disabled:opacity-50 text-xs font-bold uppercase tracking-[0.16em] transition-opacity inline-flex items-center justify-center gap-2"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] pt-4 border-t border-[#EDEAE2] dark:border-white/10 text-center">
            New to SOLEVERSE?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#101114] dark:text-[#D7FF45] underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
