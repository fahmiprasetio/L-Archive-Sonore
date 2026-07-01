'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Package, MapPin } from 'lucide-react';
import OrderTracker from '@/components/order/OrderTracker';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TrackedOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_address?: string | null;
  items: OrderItem[];
  total: number;
  discount?: number;
  coupon_code?: string | null;
  status: string;
  created_at: string;
}

function TrackContent() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill Order ID dari query (mis. tautan dari halaman sukses checkout).
  useEffect(() => {
    const qId = params.get('order_id');
    if (qId) setOrderId(qId);
  }, [params]);

  const lookup = useCallback(async (id: string, mail: string) => {
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: id.trim(), email: mail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Pesanan tidak ditemukan');
        return;
      }
      setOrder(data.order as TrackedOrder);
    } catch {
      setError('Gagal memuat pesanan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      setError('Isi Order ID dan email yang dipakai saat checkout.');
      return;
    }
    lookup(orderId, email);
  };

  const currency = (n: number) => '$' + n.toLocaleString('en-US');

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </Link>

      <div className="flex items-center gap-2">
        <Search className="h-6 w-6 text-sage-primary" />
        <h1 className="text-2xl font-extrabold text-neutral-900">Lacak Pesanan</h1>
      </div>
      <p className="text-sm text-neutral-600">
        Belanja sebagai tamu? Masukkan Order ID dan email yang Anda gunakan saat checkout
        untuk melihat status pesanan.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div>
          <label htmlFor="order_id" className="block text-sm font-medium text-neutral-700 mb-1">
            Order ID
          </label>
          <input
            id="order_id"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="LARCHIVE-..."
            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-800 transition disabled:opacity-50 sm:w-auto sm:px-6"
          >
            <Search className="h-4 w-4" />
            {loading ? 'Mencari...' : 'Lacak Pesanan'}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {order && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <p className="font-mono text-xs text-neutral-500">{order.id}</p>
              <p className="text-xs text-neutral-400">{new Date(order.created_at).toLocaleString('id-ID')}</p>
            </div>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-neutral-700">
              {order.status}
            </span>
          </div>

          <div className="mt-4">
            <OrderTracker status={order.status} />
          </div>

          {order.customer_address && (
            <p className="mt-4 flex items-start gap-1.5 text-xs text-neutral-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{order.customer_address}</span>
            </p>
          )}

          <div className="mt-3 space-y-1.5">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-neutral-700">
                  {item.name} <span className="text-neutral-400">x{item.quantity}</span>
                </span>
                <span className="text-neutral-900">{currency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {order.discount ? (
            <div className="mt-2 flex justify-between text-sm text-green-700">
              <span>Diskon{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>
              <span>-{currency(order.discount)}</span>
            </div>
          ) : null}

          <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-neutral-900">
            <span>Total</span>
            <span>{currency(order.total)}</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
            <Package className="h-3.5 w-3.5" />
            <span>Konfirmasi dikirim ke {order.customer_email}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-400">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
