'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchMyOrders } from '@/lib/db/orders';
import type { Order } from '@/lib/db/orders';
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setOrders(await fetchMyOrders());
      } catch (e) {
        setError((e as Error)?.message || 'Gagal memuat pesanan');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const currency = (n: number) => '$' + n.toLocaleString('en-US');

  const statusColor = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'failed') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="py-16 text-center text-neutral-500">
        <p className="text-lg font-medium">Loading orders...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Link href="/profile" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </Link>

      <div className="flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-sage-primary" />
        <h1 className="text-2xl font-extrabold text-neutral-900">My Orders</h1>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          Riwayat pesanan membutuhkan Supabase aktif. Isi NEXT_PUBLIC_SUPABASE_URL & ANON_KEY untuk mengaktifkannya.
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16 text-center">
          <Package className="h-10 w-10 text-neutral-300" />
          <p className="mt-3 font-medium text-neutral-700">Belum ada pesanan</p>
          <Link href="/shop" className="mt-4 inline-flex items-center gap-2 rounded bg-sage-primary px-5 py-2 text-sm font-semibold text-white hover:bg-sage-secondary transition">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <p className="font-mono text-xs text-neutral-500">{o.id}</p>
                  <p className="text-xs text-neutral-400">{new Date(o.created_at).toLocaleString('id-ID')}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(o.status)}`}>
                  {o.status}
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-neutral-700">{item.name} <span className="text-neutral-400">x{item.quantity}</span></span>
                    <span className="text-neutral-900">{currency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-neutral-900">
                <span>Total</span>
                <span>{currency(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
