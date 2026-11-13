import React, { useEffect, useState } from 'react';
import { Heart, LogOut, MapPin, Package, ShieldCheck, Trash2, User } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  deleteAddress,
  fetchAddresses,
  saveAddress,
  updateProfile,
} from '../services/accountService';
import { Address } from '../types';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, profile, loading, isAdmin, signOut, updatePassword, refreshProfile } = useAuth();
  const { wishlistProducts, showToast } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [addingAddr, setAddingAddr] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [updatingPwd, setUpdatingPwd] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    fetchAddresses(user.id)
      .then(setAddresses)
      .catch(() => {});
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-sm text-[#52525B] dark:text-[#C5C7CB]">
        Loading your SOLEVERSE profile...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/account' }} replace />;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(user.id, { full_name: fullName.trim(), phone: phone.trim() });
      await refreshProfile();
      showToast('Profile information updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim()) return;
    setAddingAddr(true);
    try {
      const saved = await saveAddress(user.id, {
        label: newLabel.trim() || 'Home',
        full_name: fullName || profile?.full_name || 'Recipient',
        phone: phone || profile?.phone || '',
        street_address: newStreet.trim(),
        city: newCity.trim(),
        postal_code: newPostal.trim(),
        is_default: addresses.length === 0,
      });
      setAddresses((prev) => [saved, ...prev]);
      setNewStreet('');
      setNewCity('');
      setNewPostal('');
      showToast('Delivery address saved.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save address.', 'error');
    } finally {
      setAddingAddr(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Address removed.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete address.', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setUpdatingPwd(true);
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      showToast('Account password updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update password.', 'error');
    } finally {
      setUpdatingPwd(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    showToast('Signed out cleanly.', 'info');
    navigate('/');
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#F5F3ED] dark:bg-[#101114] border border-[#C5C7CB]/60 dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED] focus:outline-none focus:border-[#101114] dark:focus:border-[#D7FF45]';

  return (
    <>
      <SeoHead
        title="My Account"
        description="Manage your SOLEVERSE profile, addresses, and orders."
        canonicalPath="/account"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#C5C7CB]/60 dark:border-white/10 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Client Dashboard
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold">
              {profile?.full_name || user.email}
            </h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB] mt-1">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-[#D7FF45] text-[#101114] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:brightness-95"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 border border-[#101114] dark:border-white/25 text-xs font-semibold uppercase tracking-wider hover:bg-[#101114] hover:text-white dark:hover:bg-white dark:hover:text-[#101114] transition-colors inline-flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link
            to="/account/orders"
            className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-5 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors flex items-center gap-4"
          >
            <Package className="w-6 h-6 text-[#101114] dark:text-[#D7FF45] shrink-0" />
            <div>
              <p className="text-sm font-semibold">My Orders & Tracking</p>
              <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                Inspect shipment statuses & COD receipts
              </p>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-5 hover:border-[#101114] dark:hover:border-[#D7FF45] transition-colors flex items-center gap-4"
          >
            <Heart className="w-6 h-6 text-[#101114] dark:text-[#D7FF45] shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                Saved Wishlist ({wishlistProducts.length})
              </p>
              <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">
                Move saved pairs directly to bag
              </p>
            </div>
          </Link>

          <div className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-5 flex items-center gap-4">
            <User className="w-6 h-6 text-[#101114] dark:text-[#D7FF45] shrink-0" />
            <div>
              <p className="text-sm font-semibold">Account Tier</p>
              <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] capitalize">
                {profile?.role ?? 'customer'} · Verified Client
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSaveProfile}
              className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 space-y-4"
            >
              <h2 className="font-editorial text-xl font-semibold">Profile Information</h2>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-wider hover:opacity-90"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 space-y-4"
            >
              <h2 className="font-editorial text-xl font-semibold">Account Settings</h2>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB] mb-1">
                  Update Password
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={updatingPwd}
                className="px-6 py-2.5 border border-[#101114] dark:border-[#D7FF45] text-[#101114] dark:text-[#D7FF45] hover:bg-[#101114] hover:text-white dark:hover:bg-[#D7FF45] dark:hover:text-[#101114] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {updatingPwd ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#202126] border border-[#C5C7CB]/60 dark:border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDEAE2] dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#101114] dark:text-[#D7FF45]" />
                <h2 className="font-editorial text-xl font-semibold">
                  Saved Delivery Addresses
                </h2>
              </div>
            </div>

            {addresses.length === 0 ? (
              <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
                No saved addresses yet. Add a primary shipping destination for faster COD checkout.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-[#C5C7CB]/60 dark:border-white/10 bg-[#F5F3ED] dark:bg-[#101114] p-4 flex justify-between items-start gap-2"
                  >
                    <div className="text-sm space-y-0.5">
                      <p className="font-semibold">
                        {addr.label} {addr.is_default ? '· Default' : ''}
                      </p>
                      <p className="text-[#3F3F46] dark:text-[#C5C7CB]">{addr.street_address}</p>
                      <p className="text-[#52525B] dark:text-[#C5C7CB]/70 text-xs">
                        {addr.city} {addr.postal_code}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label="Delete address"
                      className="text-[#71717A] hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handleAddAddress}
              className="pt-4 border-t border-[#EDEAE2] dark:border-white/10 space-y-3"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
                Add New Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (Home / Office)"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="City *"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={newPostal}
                  onChange={(e) => setNewPostal(e.target.value)}
                  placeholder="Postal Code"
                  className={`${inputCls} font-mono`}
                />
              </div>
              <input
                type="text"
                required
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="Complete Street Address *"
                className={inputCls}
              />
              <button
                type="submit"
                disabled={addingAddr}
                className="px-5 py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-bold uppercase tracking-wider hover:opacity-90"
              >
                {addingAddr ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
