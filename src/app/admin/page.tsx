'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { Package, Tags, DollarSign, Users, TrendingUp } from 'lucide-react';

export default function AdminOverviewPage() {
  const products = useProductStore((s) => s.products);
  const [mounted, setMounted] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      setUserCount(Array.isArray(mockUsers) ? mockUsers.length : 0);
    } catch {
      setUserCount(0);
    }
  }, []);

  const list = mounted ? products : [];

  const categoryCounts: Record<string, number> = {};
  list.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const categories = Object.keys(categoryCounts).sort();

  const totalValue = list.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = list.length > 0 ? Math.round(totalValue / list.length) : 0;

  const currency = (n: number) => '$' + n.toLocaleString('en-US');

  const stats = [
    { label: 'Total Products', value: list.length.toString(), icon: Package },
    { label: 'Categories', value: categories.length.toString(), icon: Tags },
    { label: 'Inventory Value', value: currency(totalValue), icon: DollarSign },
    { label: 'Avg. Price', value: currency(avgPrice), icon: TrendingUp },
    { label: 'Registered Users', value: userCount.toString(), icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
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

      {/* Category breakdown */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
          Products by Category
        </h2>
        <div className="mt-4 space-y-3">
          {categories.length === 0 && (
            <p className="text-sm text-neutral-500">No products yet.</p>
          )}
          {categories.map((cat) => {
            const count = categoryCounts[cat];
            const pct = list.length > 0 ? Math.round((count / list.length) * 100) : 0;
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
