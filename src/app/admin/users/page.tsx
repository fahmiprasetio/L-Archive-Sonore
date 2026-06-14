'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { isAdminEmail } from '@/lib/admin';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchAllOrdersAdmin, updateOrderStatusAdmin, ORDER_STATUSES } from '@/lib/db/orders';
import type { Order } from '@/lib/db/orders';
import { toast } from '@/store/toastStore';
import { Users, ShoppingBag, ShieldCheck } from 'lucide-react';

interface MockUser {
  id: string;
  email: string;
  name: string;
}

export default function AdminUsersPage() {
  const { isMockMode } = useAuthStore();
  const [users, setUsers] = useState<MockUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      if (Array.isArray(mockUsers)) {
        setUsers(mockUsers.map((u: { id: string; email: string; name: string }) => ({ id: u.id, email: u.email, name: u.name })));
      }
    } catch {
      setUsers([]);
    }
    (async () => {
      if (isSupabaseConfigured()) {
        try {
          setOrders(await fetchAllOrdersAdmin());
        } catch {
          // ignore
        }
      }
    })();
  }, []);

  if (!mounted) return null;

  const currency = (n: number) => '$' + n.toLocaleString('en-US');

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-neutral-200 text-neutral-600';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const previous = orders;
    setUpdatingId(id);
    // Optimistic update
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await updateOrderStatusAdmin(id, status);
      toast.success(`Order updated to "${status}"`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update order status');
      setOrders(previous); // revert
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Users */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 px-6 py-4">
          <Users className="h-5 w-5 text-sage-primary" />
          <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
            Users
          </h2>
          <span className="ml-auto rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            {users.length}
          </span>
        </div>

        {!isMockMode && (
          <p className="px-6 py-4 text-sm text-neutral-500">
            Auth aktif memakai Supabase. Daftar lengkap pengguna hanya bisa diambil dari sisi server memakai service-role key. Kelola pengguna langsung di dashboard Supabase &rarr; Authentication &rarr; Users.
          </p>
        )}

        {isMockMode && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-neutral-400">
                      Belum ada pengguna terdaftar (mock).
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-3 font-medium text-neutral-900">{u.name}</td>
                    <td className="px-6 py-3 text-neutral-600">{u.email}</td>
                    <td className="px-6 py-3">
                      {isAdminEmail(u.email) ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage-primary/10 px-2.5 py-0.5 text-xs font-semibold text-sage-primary">
                          <ShieldCheck className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">Member</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 px-6 py-4">
          <ShoppingBag className="h-5 w-5 text-sage-primary" />
          <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
            Orders
          </h2>
          <span className="ml-auto rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            {orders.length}
          </span>
        </div>

        {!isSupabaseConfigured() ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <ShoppingBag className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm font-medium text-neutral-600">Supabase belum terkonfigurasi</p>
            <p className="mt-1 max-w-md text-xs text-neutral-400">
              Isi NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, & SUPABASE_SERVICE_ROLE_KEY lalu jalankan supabase/schema.sql untuk mulai mencatat pesanan.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <ShoppingBag className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm font-medium text-neutral-600">Belum ada pesanan</p>
            <p className="mt-1 max-w-md text-xs text-neutral-400">
              Pesanan akan muncul di sini setiap kali pelanggan melakukan checkout.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-3 font-mono text-xs text-neutral-700">{o.id}</td>
                    <td className="px-6 py-3">
                      <p className="font-medium text-neutral-900">{o.customer_name}</p>
                      <p className="text-xs text-neutral-500">{o.customer_email}</p>
                    </td>
                    <td className="px-6 py-3 font-semibold text-neutral-900">{currency(o.total)}</td>
                    <td className="px-6 py-3">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-sage-primary/40 disabled:opacity-50 ${statusColor(o.status)}`}
                        aria-label={`Status for order ${o.id}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-white capitalize text-neutral-900">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3 text-xs text-neutral-500">
                      {new Date(o.created_at).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
