'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchAllOrdersAdmin, type Order } from '@/lib/db/orders';
import {
  Package,
  Tags,
  DollarSign,
  Users,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Clock,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

// Status pesanan yang dihitung sebagai pendapatan (sudah dibayar / dalam fulfillment).
const REVENUE_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function statusBadge(status: string): string {
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
}

export default function AdminOverviewPage() {
  const products = useProductStore((s) => s.products);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const [userCount, setUserCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadProducts();
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      setUserCount(Array.isArray(mockUsers) ? mockUsers.length : 0);
    } catch {
      setUserCount(0);
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
  }, [loadProducts]);

  const m = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const categories = Object.keys(categoryCounts).sort();

    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = products.length > 0 ? Math.round(totalValue / products.length) : 0;
    const lowStock = products
      .filter((p) => typeof p.stock === 'number' && (p.stock as number) <= 3)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    const outOfStock = products.filter(
      (p) => typeof p.stock === 'number' && (p.stock as number) <= 0
    ).length;

    const revenueOrders = orders.filter((o) => REVENUE_STATUSES.includes(o.status));
    const totalRevenue = revenueOrders.reduce((s, o) => s + Number(o.total || 0), 0);
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const recentOrders = orders.slice(0, 5);

    const now = new Date();
    const trend: { key: string; label: string; value: number }[] = [];
    const trendIndex: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      trendIndex[key] = trend.length;
      trend.push({ key, label: MONTHS[d.getMonth()], value: 0 });
    }
    for (const o of revenueOrders) {
      const d = new Date(o.created_at);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (key in trendIndex) trend[trendIndex[key]].value += Number(o.total || 0);
    }
    const trendMax = trend.reduce((mx, t) => Math.max(mx, t.value), 1);

    return {
      categoryCounts,
      categories,
      totalValue,
      avgPrice,
      lowStock,
      outOfStock,
      totalRevenue,
      pendingCount,
      recentOrders,
      ordersCount: orders.length,
      trend,
      trendMax,
    };
  }, [products, orders]);

  const currency = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

  const stats = [
    { label: 'Total Revenue', value: currency(m.totalRevenue), icon: DollarSign },
    { label: 'Orders', value: m.ordersCount.toString(), icon: ShoppingBag },
    { label: 'Pending Orders', value: m.pendingCount.toString(), icon: Clock },
    { label: 'Total Products', value: products.length.toString(), icon: Package },
    { label: 'Categories', value: m.categories.length.toString(), icon: Tags },
    { label: 'Inventory Value', value: currency(m.totalValue), icon: TrendingUp },
    { label: 'Out of Stock', value: m.outOfStock.toString(), icon: AlertTriangle },
    { label: 'Registered Users', value: userCount.toString(), icon: Users },
  ];

  const hasTrend = m.trend.some((t) => t.value > 0);

  return (
    <div className="space-y-8">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sage-primary">
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {s.label}
                </span>
              </div>
              <p className="mt-3 font-clash text-2xl font-bold text-neutral-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue trend */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sage-primary" />
            <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
              Revenue (6 bulan terakhir)
            </h2>
          </div>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sage-primary hover:underline"
          >
            Laporan lengkap <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {!hasTrend ? (
          <p className="text-sm text-neutral-500">Belum ada pendapatan tercatat.</p>
        ) : (
          <div className="flex h-44 items-end gap-3">
            {m.trend.map((t) => {
              const h = Math.max(3, Math.round((t.value / m.trendMax) * 100));
              const barStyle = { height: h + '%' };
              return (
                <div
                  key={t.key}
                  className="flex flex-1 flex-col items-center gap-2"
                  title={`${t.label}: ${currency(t.value)}`}
                >
                  <div className="flex w-full flex-1 items-end">
                    <div className="w-full rounded-t bg-sage-primary transition-all" style={barStyle} />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-400">{t.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
              Pesanan Terbaru
            </h2>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sage-primary hover:underline"
            >
              Kelola <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {m.recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-3">
              {m.recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">{o.customer_name}</p>
                    <p className="truncate text-xs text-neutral-400">
                      {new Date(o.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge(o.status)}`}
                    >
                      {o.status}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {currency(Number(o.total || 0))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
                Stok Menipis
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sage-primary hover:underline"
            >
              Kelola stok <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {m.lowStock.length === 0 ? (
            <p className="text-sm text-neutral-500">Semua produk stoknya aman.</p>
          ) : (
            <div className="space-y-3">
              {m.lowStock.slice(0, 6).map((p) => {
                const stock = p.stock ?? 0;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{p.name}</p>
                      <p className="truncate text-xs text-neutral-400">{p.category}</p>
                    </div>
                    {stock <= 0 ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Sold out
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        {stock} left
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Products by category */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
          Products by Category
        </h2>
        <div className="mt-4 space-y-3">
          {m.categories.length === 0 && (
            <p className="text-sm text-neutral-500">No products yet.</p>
          )}
          {m.categories.map((cat) => {
            const count = m.categoryCounts[cat];
            const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
            const barStyle = { width: pct + '%' };
            return (
              <div key={cat}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700">{cat}</span>
                  <span className="text-neutral-400">{count} ({pct}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-sage-primary" style={barStyle} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
