'use client';

import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchAllOrdersAdmin, ORDER_STATUSES, type Order } from '@/lib/db/orders';
import { DollarSign, ShoppingBag, TrendingUp, Package, Clock, Download, Loader2, Database } from 'lucide-react';

// Status yang dihitung sebagai pendapatan (sudah dibayar / dalam fulfillment).
const REVENUE_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

const RANGES = [
  { id: 'all', label: 'All time', days: Infinity },
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: '1y', label: '1 year', days: 365 },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-400',
  paid: 'bg-green-500',
  processing: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-emerald-600',
  cancelled: 'bg-neutral-400',
  failed: 'bg-red-500',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('30d');

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoaded(true);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAllOrdersAdmin();
        setOrders(data);
      } catch (e) {
        setError((e as Error)?.message || 'Gagal memuat pesanan');
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    })();
  }, [configured]);

  const report = useMemo(() => {
    const def = RANGES.find((r) => r.id === range) ?? RANGES[0];
    const now = Date.now();
    const rangeMs = def.days === Infinity ? Infinity : def.days * 86400000;

    const filtered = orders.filter((o) => {
      if (rangeMs === Infinity) return true;
      const t = new Date(o.created_at).getTime();
      return Number.isFinite(t) && now - t <= rangeMs;
    });

    const revenueOrders = filtered.filter((o) => REVENUE_STATUSES.includes(o.status));
    const totalRevenue = revenueOrders.reduce((s, o) => s + Number(o.total || 0), 0);
    const paidCount = revenueOrders.length;
    const aov = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;
    const itemsSold = revenueOrders.reduce(
      (s, o) => s + (o.items || []).reduce((a, i) => a + (Number(i.quantity) || 0), 0),
      0
    );
    const pendingCount = filtered.filter((o) => o.status === 'pending').length;

    const statusBreakdown = ORDER_STATUSES.map((st) => {
      const list = filtered.filter((o) => o.status === st);
      const revenue = list.reduce((s, o) => s + Number(o.total || 0), 0);
      return { status: st, count: list.length, revenue };
    }).filter((s) => s.count > 0);

    const prodMap: Record<string, { id: string; name: string; qty: number; revenue: number }> = {};
    for (const o of revenueOrders) {
      for (const it of o.items || []) {
        const key = it.id || it.name;
        if (!prodMap[key]) prodMap[key] = { id: key, name: it.name || key, qty: 0, revenue: 0 };
        prodMap[key].qty += Number(it.quantity) || 0;
        prodMap[key].revenue += (Number(it.price) || 0) * (Number(it.quantity) || 0);
      }
    }
    const topProducts = Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    const groupByMonth = def.days === Infinity || def.days > 90;
    const buckets: Record<string, number> = {};
    for (const o of revenueOrders) {
      const d = new Date(o.created_at);
      if (Number.isNaN(d.getTime())) continue;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const key = groupByMonth
        ? `${d.getFullYear()}-${mm}`
        : `${d.getFullYear()}-${mm}-${String(d.getDate()).padStart(2, '0')}`;
      buckets[key] = (buckets[key] || 0) + Number(o.total || 0);
    }
    const trendKeys = Object.keys(buckets).sort();
    const trendMax = trendKeys.reduce((m, k) => Math.max(m, buckets[k]), 1);

    return {
      filtered,
      totalRevenue,
      paidCount,
      aov,
      itemsSold,
      pendingCount,
      statusBreakdown,
      topProducts,
      groupByMonth,
      buckets,
      trendKeys,
      trendMax,
    };
  }, [orders, range]);

  const currency = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

  const fmtBucketLabel = (key: string) => {
    const parts = key.split('-');
    if (parts.length === 3) return parts[2];
    return MONTHS[Number(parts[1]) - 1] ?? key;
  };

  const exportCsv = () => {
    const header = ['Order ID', 'Date', 'Customer', 'Email', 'Status', 'Items', 'Total'];
    const rows = report.filtered.map((o) => [
      o.id,
      new Date(o.created_at).toISOString(),
      o.customer_name,
      o.customer_email,
      o.status,
      (o.items || []).reduce((a, i) => a + (Number(i.quantity) || 0), 0),
      o.total,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxStatusCount = report.statusBreakdown.reduce((m, s) => Math.max(m, s.count), 1);

  const kpis = [
    { label: 'Total Revenue', value: currency(report.totalRevenue), icon: DollarSign },
    { label: 'Paid Orders', value: report.paidCount.toString(), icon: ShoppingBag },
    { label: 'Avg. Order Value', value: currency(report.aov), icon: TrendingUp },
    { label: 'Items Sold', value: report.itemsSold.toString(), icon: Package },
    { label: 'Pending', value: report.pendingCount.toString(), icon: Clock },
  ];

  if (!configured) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <Database className="mx-auto h-8 w-8 text-neutral-300" />
        <h2 className="mt-3 font-clash text-lg font-semibold text-neutral-900">Laporan butuh Supabase</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
          Data pesanan disimpan di Supabase. Isi environment variable Supabase (termasuk SUPABASE_SERVICE_ROLE_KEY) untuk melihat laporan penjualan.
        </p>
      </div>
    );
  }

  if (!loaded || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-neutral-400">
        <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Memuat laporan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar: range + export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                range === r.id ? 'bg-sage-primary text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          disabled={report.filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:text-neutral-900 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {report.filtered.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-400 shadow-sm">
          Belum ada pesanan pada rentang waktu ini.
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sage-primary">
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {k.label}
                    </span>
                  </div>
                  <p className="mt-3 font-clash text-2xl font-bold text-neutral-900">{k.value}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue trend */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
                Revenue Trend
              </h2>
              <span className="text-xs text-neutral-400">{report.groupByMonth ? 'Per month' : 'Per day'}</span>
            </div>
            {report.trendKeys.length === 0 ? (
              <p className="text-sm text-neutral-500">Belum ada pendapatan pada rentang ini.</p>
            ) : (
              <div className="flex h-44 items-end gap-1">
                {report.trendKeys.map((k) => {
                  const h = Math.max(3, Math.round((report.buckets[k] / report.trendMax) * 100));
                  const barStyle = { height: h + '%' };
                  return (
                    <div
                      key={k}
                      className="flex flex-1 flex-col items-center gap-1"
                      title={`${k}: ${currency(report.buckets[k])}`}
                    >
                      <div className="flex w-full flex-1 items-end">
                        <div className="w-full rounded-t bg-sage-primary transition-all" style={barStyle} />
                      </div>
                      <span className="text-[9px] text-neutral-400">{fmtBucketLabel(k)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Status breakdown */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
                Orders by Status
              </h2>
              <div className="mt-4 space-y-3">
                {report.statusBreakdown.map((s) => {
                  const pct = Math.round((s.count / maxStatusCount) * 100);
                  const barStyle = { width: Math.max(4, pct) + '%' };
                  const color = STATUS_STYLES[s.status] ?? 'bg-sage-primary';
                  return (
                    <div key={s.status}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium capitalize text-neutral-700">{s.status}</span>
                        <span className="text-neutral-400">
                          {s.count} · {currency(s.revenue)}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div className={`h-full rounded-full ${color}`} style={barStyle} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top products */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
                Top Products
              </h2>
              <div className="mt-4 overflow-x-auto">
                {report.topProducts.length === 0 ? (
                  <p className="text-sm text-neutral-500">Belum ada produk terjual.</p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="text-[11px] uppercase tracking-wider text-neutral-400">
                      <tr>
                        <th className="pb-2 font-semibold">Product</th>
                        <th className="pb-2 text-right font-semibold">Qty</th>
                        <th className="pb-2 text-right font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {report.topProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2 pr-2 font-medium text-neutral-800">{p.name}</td>
                          <td className="py-2 text-right text-neutral-600">{p.qty}</td>
                          <td className="py-2 text-right font-semibold text-neutral-900">{currency(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400">
            Pendapatan dihitung dari pesanan berstatus paid, processing, shipped, atau delivered.
          </p>
        </>
      )}
    </div>
  );
}
