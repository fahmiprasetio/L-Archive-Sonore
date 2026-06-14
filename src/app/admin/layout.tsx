'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { isAdminEmail } from '@/lib/admin';
import { LayoutDashboard, Package, Users, ShieldCheck, ArrowLeft, Loader2, BarChart3 } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/users', label: 'Users & Orders', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  const admin = isAdminEmail(user?.email);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/signin');
    } else if (!admin) {
      router.replace('/');
    } else {
      setAllowed(true);
    }
  }, [user, loading, admin, router]);

  if (loading || !allowed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm font-medium uppercase tracking-wider">Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Admin header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sage-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="mt-1 font-clash text-3xl font-bold uppercase tracking-wide text-neutral-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Signed in as <span className="font-semibold text-neutral-700">{user?.email}</span>
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </div>

      {/* Tab nav */}
      <nav className="mb-8 flex flex-wrap gap-2 border-b border-neutral-200">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-sage-primary text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
