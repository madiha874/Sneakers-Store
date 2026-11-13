import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { SupabaseNoticeBanner } from '../components/common/SupabaseNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();
  const { showToast } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError('Supabase environment variables must be configured to register accounts.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await signUp({ email, password, fullName, phone });
      if (res.needsEmailConfirmation) {
        setConfirmationSent(true);
      } else {
        showToast('Account created. Welcome to SOLEVERSE.', 'success');
        navigate('/account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register account.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]';

  return (
    <>
      <SeoHead
        title="Create Account"
        description="Register for a SOLEVERSE customer account."
        canonicalPath="/register"
      />

      <div className="max-w-lg mx-auto px-4 py-14 sm:py-20 space-y-6">
        <SupabaseNoticeBanner context="auth" />

        <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-8 sm:p-10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Membership
            </p>
            <h1 className="font-editorial text-3xl font-semibold">Create Account</h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mt-1">
              Save your sizing, track nationwide COD deliveries, and manage your wishlist.
            </p>
          </div>

          {confirmationSent ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-400/40 text-emerald-900 dark:text-emerald-200 p-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verification Email Sent</span>
              </div>
              <p>
                Please check <strong>{email}</strong> and click the confirmation link to activate
                your SOLEVERSE account.
              </p>
              <Link to="/login" className="inline-block pt-2 font-semibold underline">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="bg-red-50 dark:bg-red-950/50 border border-red-400/50 text-red-900 dark:text-red-200 p-3.5 text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Zainab Tariq"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  Email Address *
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] hover:opacity-90 disabled:opacity-50 text-xs font-bold uppercase tracking-[0.16em] transition-opacity inline-flex items-center justify-center gap-2"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] pt-4 border-t border-[#EDEAE2] dark:border-white/10 text-center">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#101114] dark:text-[#D7FF45] underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
