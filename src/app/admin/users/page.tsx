'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { isAdminEmail } from '@/lib/admin';
import { Users, ShoppingBag, ShieldCheck } from 'lucide-react';

interface MockUser {
  id: string;
  email: string;
  name: string;
}

export default function AdminUsersPage() {
  const { isMockMode } = useAuthStore();
  const [users, setUsers] = useState<MockUser[]>([]);
  const [mounted, setMounted] = useState(false);

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
  }, []);

  if (!mounted) return null;

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
            Auth aktif memakai Supabase. Daftar lengkap pengguna hanya bisa diambil dari sisi server memakai service-role key (tidak aman di browser). Kelola pengguna langsung di dashboard Supabase &rarr; Authentication &rarr; Users.
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
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <ShoppingBag className="h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm font-medium text-neutral-600">Belum ada sistem pesanan persisten</p>
          <p className="mt-1 max-w-md text-xs text-neutral-400">
            Checkout saat ini memakai Midtrans tanpa menyimpan riwayat pesanan. Tambahkan tabel orders di Supabase untuk mulai mencatat dan menampilkan pesanan di sini.
          </p>
        </div>
      </div>
    </div>
  );
}
