'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import type { ProductInput } from '@/store/productStore';
import type { Product } from '@/types';
import { Plus, Pencil, Trash2, X, Search, RotateCcw } from 'lucide-react';

const EMPTY_FORM: ProductInput = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category: '',
};

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);

  useEffect(() => {
    setMounted(true);
  }, []);

  const list = mounted ? products : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [list, query]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category: p.category,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) return;
    if (editingId) {
      updateProduct(editingId, form);
    } else {
      addProduct(form);
    }
    closeForm();
  };

  const currency = (n: number) => '$' + n.toLocaleString('en-US');

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-sage-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Reset semua produk ke data awal? Perubahan Anda akan hilang.')) resetProducts();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-500 transition hover:text-neutral-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-sage-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-secondary"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Form panel */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-clash text-base font-semibold uppercase tracking-wider text-neutral-900">
              {editingId ? 'Edit Product' : 'New Product'}
            </h3>
            <button type="button" onClick={closeForm} className="text-neutral-400 hover:text-neutral-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                placeholder="Guitar, Piano, ..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">Price ($)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage-primary"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={closeForm} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-sage-primary px-5 py-2 text-sm font-semibold text-white hover:bg-sage-secondary">
              {editingId ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-neutral-400">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-10 w-10 flex-shrink-0 rounded-md bg-neutral-100 object-cover"
                      />
                      <span className="font-medium text-neutral-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">{currency(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-md p-2 text-neutral-500 transition hover:bg-sage-primary/10 hover:text-sage-primary"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus \"${p.name}\"?`)) deleteProduct(p.id);
                        }}
                        className="rounded-md p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        Perubahan disimpan di browser (localStorage) dan langsung tampil di halaman Shop. Untuk persistensi permanen lintas perangkat, hubungkan ke tabel Supabase.
      </p>
    </div>
  );
}
