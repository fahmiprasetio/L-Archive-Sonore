'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { isAdminEmail } from '@/lib/admin';
import {
  LogOut,
  ShieldAlert,
  ShoppingCart,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Mail,
  Fingerprint,
  ChevronRight,
  Heart,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, signOut, isMockMode } = useAuthStore();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = useWishlistStore((state) => state.ids.length);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-medium text-neutral-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // will redirect in useEffect
  }

  const admin = isAdminEmail(user.email);
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {isMockMode && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 border border-amber-100 text-sm text-amber-800">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Local Dev Mock Auth Active</p>
            <p className="mt-1">
              Supabase keys belum di-set di `.env.local`. Sesi & akun saat ini disimpan sementara di localStorage browser.
            </p>
          </div>
        </div>
      )}

      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-32 w-full bg-gradient-to-r from-sage-primary via-[#6f8268] to-[#3A4438]" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#2E3A2C] font-clash text-4xl font-bold text-white ring-4 ring-white shadow-md">
              {initial}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="font-clash text-2xl font-bold text-neutral-900">{user.name}</h1>
              <div className="mt-1">
                {admin ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-primary/10 px-3 py-1 text-xs font-semibold text-sage-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                    Member
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {admin && (
          <Link
            href="/admin"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-sage-primary/30 bg-sage-primary/5 p-5 transition hover:bg-sage-primary/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-primary/15 text-sage-primary">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Admin Dashboard</p>
                <p className="text-xs text-neutral-500">Kelola produk, user &amp; pesanan</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-sage-primary transition group-hover:translate-x-1" />
          </Link>
        )}

        <Link
          href="/orders"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">My Orders</p>
              <p className="text-xs text-neutral-500">Riwayat &amp; status pesanan</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/wishlist"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">My Wishlist</p>
              <p className="text-xs text-neutral-500">{wishlistCount} item{wishlistCount !== 1 ? 's' : ''} disimpan</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/cart"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Shopping Cart</p>
              <p className="text-xs text-neutral-500">{totalItems} item{totalItems !== 1 ? 's' : ''} di keranjang</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Account details */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-clash text-base font-semibold uppercase tracking-wider text-neutral-900">
          Account Details
        </h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
            <Mail className="h-4 w-4 text-sage-primary mt-0.5" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Email</p>
              <p className="text-sm text-neutral-900 break-all">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
            <Fingerprint className="h-4 w-4 text-sage-primary mt-0.5" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">User ID</p>
              <p className="font-mono text-xs text-neutral-700 break-all">{user.id}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
            <ShieldCheck className="h-4 w-4 text-sage-primary mt-0.5" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Authentication</p>
              <p className="text-sm font-medium text-neutral-900">
                {isMockMode ? 'Mock Local Auth' : 'Live Supabase Auth'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
