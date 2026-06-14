'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { isAdminEmail } from '@/lib/admin';
import { LogOut, User, ShieldAlert, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, signOut, isMockMode } = useAuthStore();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
        {isMockMode && (
          <div className="flex items-start gap-3 rounded bg-amber-50 p-4 border border-amber-100 text-sm text-amber-800">
            <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Local Dev Mock Auth Active</p>
              <p className="mt-1">
                Supabase keys are not set or are using defaults in `.env.local`. 
                Sessions and accounts are currently mock stored in browser localStorage.
              </p>
            </div>
          </div>
        )}

        {admin && (
          <Link
            href="/admin"
            className="flex items-center justify-between gap-3 rounded-lg border border-sage-primary/30 bg-sage-primary/5 p-4 transition hover:bg-sage-primary/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-primary/15 text-sage-primary">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Admin Dashboard</p>
                <p className="text-xs text-neutral-500">Kelola produk, lihat user &amp; pesanan</p>
              </div>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-primary">Open &rarr;</span>
          </Link>
        )}

        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="h-16 w-16 rounded-full bg-neutral-900 flex items-center justify-center text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
            <p className="text-neutral-500 text-sm">{admin ? 'Administrator' : 'Member Account'}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <h2 className="text-lg font-bold text-neutral-900">Account Details</h2>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-50">
            <span className="text-neutral-500 font-medium">User ID</span>
            <span className="col-span-2 text-neutral-900 font-mono break-all">{user.id}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-50">
            <span className="text-neutral-500 font-medium">Email Address</span>
            <span className="col-span-2 text-neutral-900">{user.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-50">
            <span className="text-neutral-500 font-medium">Authentication</span>
            <span className="col-span-2 text-neutral-900 font-medium">
              {isMockMode ? 'Mock Local Auth' : 'Live Supabase Auth'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-3 border-b border-gray-50 items-center">
            <span className="text-neutral-500 font-medium">Shopping Cart</span>
            <div className="col-span-2 flex items-center gap-3">
              <span className="text-neutral-950 font-bold bg-neutral-100 px-2 py-1 rounded text-xs">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white hover:bg-neutral-800 transition"
              >
                <ShoppingCart className="h-3 w-3" />
                View Cart
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded border border-gray-300 bg-white py-3 px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950 transition"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
