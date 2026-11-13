import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { SupabaseNoticeBanner } from '../components/common/SupabaseNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sendPasswordReset, updatePassword, user, isConfigured } = useAuth();
  const { showToast } = useStore();

  const isRecoveryMode =
    searchParams.get('mode') === 'recovery' ||
    Boolean(user && window.location.hash.includes('type=recovery'));

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isConfigured) {
      setError('Configure Supabase environment variables to send password recovery emails.');
      return;
    }
    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(newPassword);
      showToast('Password updated successfully.', 'success');
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]';

  return (
    <>
      <SeoHead
        title="Password Recovery"
        description="Reset your SOLEVERSE account password."
        canonicalPath="/forgot-password"
      />

      <div className="max-w-lg mx-auto px-4 py-14 sm:py-20 space-y-6">
        <SupabaseNoticeBanner context="auth" />

        <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-8 sm:p-10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Account Security
            </p>
            <h1 className="font-editorial text-3xl font-semibold">
              {isRecoveryMode ? 'Set New Password' : 'Reset Password'}
            </h1>
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

          {isRecoveryMode ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.16em]"
              >
                {submitting ? 'Updating...' : 'Save New Password'}
              </button>
            </form>
          ) : sent ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-400/40 text-emerald-900 dark:text-emerald-200 p-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Recovery Link Sent</span>
              </div>
              <p>
                If an account exists for <strong>{email}</strong>, a password reset link has been
                dispatched.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
                Enter the email address registered to your SOLEVERSE profile and we will send a
                secure recovery link.
              </p>
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
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-[0.16em]"
              >
                {submitting ? 'Sending Link...' : 'Send Recovery Link'}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#EDEAE2] dark:border-white/10 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-[#101114] dark:text-[#D7FF45] underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
