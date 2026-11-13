import {
  Boxes,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Moon,
  PackageCheck,
  ShieldAlert,
  ShoppingBag,
  Store,
  Sun,
  Users,
} from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { SupabaseNoticeBanner } from '../components/common/SupabaseNoticeBanner';
import { ToastStack } from '../components/common/ToastStack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured } from '../lib/supabase';

export function AdminLayout() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3ED] dark:bg-[#101114] flex items-center justify-center text-sm text-[#52525B] dark:text-[#C5C7CB]">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#F5F3ED] dark:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] p-6 sm:p-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-editorial text-2xl font-semibold tracking-[0.14em]">
              SOLEVERSE
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 border border-[#C5C7CB] dark:border-white/15 bg-white dark:bg-[#202126]"
              aria-label="Toggle Day/Night Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#D7FF45]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <SupabaseNoticeBanner context="admin" />

          <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-8 space-y-4">
            <h1 className="font-editorial text-2xl font-semibold">Admin Console Locked</h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
              The SOLEVERSE Admin Console requires an authenticated administrator account backed by
              Supabase Row Level Security. Configure{' '}
              <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>, register your user, and
              promote your account role to <code className="font-mono">admin</code> in Supabase SQL
              Editor:
            </p>
            <pre className="bg-[#101114] text-[#D7FF45] p-4 text-xs font-mono overflow-x-auto border border-white/10">
              {`UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@example.com';`}
            </pre>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F3ED] dark:bg-[#101114] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-8 sm:p-10 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-[#DC2626] mx-auto" />
          <h1 className="font-editorial text-2xl font-semibold text-[#101114] dark:text-[#F5F3ED]">
            Restricted Admin Area
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] leading-relaxed">
            {user
              ? `Signed in as ${profile?.email || user.email} (role: ${profile?.role ?? 'customer'}). Administrator privileges are required to access store operations.`
              : 'Please sign in with an authorized SOLEVERSE administrator account.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {!user && (
              <Link
                to="/login"
                state={{ from: '/admin' }}
                className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
              >
                Admin Sign In
              </Link>
            )}
            <Link
              to="/"
              className="px-6 py-3 border border-[#101114] dark:border-white/20 text-[#101114] dark:text-[#F5F3ED] text-xs font-semibold uppercase tracking-wider"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { to: '/admin', end: true, label: 'Overview & Ops', icon: LayoutDashboard },
    { to: '/admin/products', end: false, label: 'Products & CSV', icon: ShoppingBag },
    { to: '/admin/inventory', end: false, label: 'Inventory Matrix', icon: Boxes },
    { to: '/admin/categories', end: false, label: 'Categories & Brands', icon: FolderKanban },
    { to: '/admin/orders', end: false, label: 'Orders (COD)', icon: PackageCheck },
    { to: '/admin/customers', end: false, label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3ED] dark:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] flex flex-col lg:flex-row transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#101114] dark:bg-[#17181C] text-[#F5F3ED] border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 flex flex-col justify-between">
        <div>
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin" className="font-editorial text-lg font-semibold tracking-[0.14em]">
              SOLEVERSE
            </Link>
            <span className="text-[10px] uppercase tracking-widest bg-[#D7FF45] text-[#101114] px-2 py-0.5 font-mono font-bold">
              Admin
            </span>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#D7FF45] text-[#101114] font-semibold'
                        : 'text-[#C5C7CB] hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2 text-xs">
          <div className="px-2 pb-2 text-[#C5C7CB] truncate">
            {profile?.full_name || profile?.email}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 text-[#C5C7CB] hover:text-white hover:bg-white/10 text-left"
          >
            <span className="flex items-center gap-2.5">
              {isDark ? <Sun className="w-4 h-4 text-[#D7FF45]" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Day Mode (Ivory)' : 'Night Mode (Obsidian)'}</span>
            </span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-[#C5C7CB] hover:text-white hover:bg-white/10"
          >
            <Store className="w-4 h-4" />
            <span>View Live Storefront</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[#C5C7CB] hover:text-white hover:bg-white/10 text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10">
        <Outlet />
      </main>
      <ToastStack />
    </div>
  );
}
