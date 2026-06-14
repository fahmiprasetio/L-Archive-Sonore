'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import type { ProductInput } from '@/lib/db/products';
import type { Product } from '@/types';
import { Plus, Pencil, Trash2, X, Search, RotateCcw, Loader2, Database, HardDrive } from 'lucide-react';

const EMPTY_FORM: ProductInput = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category: '',
  stock: 0,
};

export default function AdminProductsPage() {
  const {
    products,
    loading,
    loaded,
    dbMode,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  } = useProductStore();

  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

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
      stock: p.stock ?? 0,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await addProduct(form);
      }
      closeForm();
    } catch (err) {
      alert((err as Error)?.message || 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Hapus \"${p.name}\"?`)) return;
    try {
      await deleteProduct(p.id);
    } catch (err) {
      alert((err as Error)?.message || 'Gagal menghapus produk');
    }
  };

  const handleReset = async () => {
    if (!confirm('Muat ulang / reset daftar produk?')) return;
    try {
      await resetProducts();
    } catch (err) {
      alert((err as Error)?.message || 'Gagal mereset produk');
    }
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
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-500 transition hover:text-neutral-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {dbMode ? 'Refresh' : 'Reset'}
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">Stock</label>
              <input
                type="number"
                min={0}
                value={form.stock ?? 0}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
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
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-sage-primary px-5 py-2 text-sm font-semibold text-white hover:bg-sage-secondary disabled:opacity-50">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
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
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && !loaded && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</span>
                  </td>
                </tr>
              )}
              {loaded && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const stock = typeof p.stock === 'number' ? p.stock : null;
                return (
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
                      {stock === null ? (
                        <span className="text-neutral-400">—</span>
                      ) : stock <= 0 ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Sold out</span>
                      ) : stock <= 3 ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{stock} left</span>
                      ) : (
                        <span className="text-neutral-700">{stock}</span>
                      )}
                    </td>
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
                          onClick={() => handleDelete(p)}
                          className="rounded-md p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-400">
        {dbMode ? (
          <span className="inline-flex items-center gap-1.5 text-sage-primary"><Database className="h-3.5 w-3.5" /> Tersambung Supabase — perubahan tersimpan permanen.</span>
        ) : (
          <span className="inline-flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Mode lokal (localStorage) — isi env Supabase untuk menyimpan ke server.</span>
        )}
      </div>
    </div>
  );
}
