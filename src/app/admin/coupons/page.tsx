'use client';

import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchAllCouponsAdmin,
  createCouponAdmin,
  updateCouponAdmin,
  deleteCouponAdmin,
  type AdminCoupon,
  type CouponInput,
} from '@/lib/db/admin-coupons';
import { Ticket, Plus, Pencil, Trash2, Loader2, Database, X, Power } from 'lucide-react';

type FormState = {
  code: string;
  type: 'percent' | 'fixed';
  value: string;
  min_subtotal: string;
  expires_at: string;
  max_redemptions: string;
  active: boolean;
};

const emptyForm: FormState = {
  code: '',
  type: 'percent',
  value: '',
  min_subtotal: '',
  expires_at: '',
  max_redemptions: '',
  active: true,
};

export default function AdminCouponsPage() {
  const configured = isSupabaseConfigured();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setCoupons(await fetchAllCouponsAdmin());
      setError(null);
    } catch (e) {
      setError((e as Error)?.message || 'Gagal memuat kupon');
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!configured) {
      setLoaded(true);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  const currency = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      min_subtotal: c.min_subtotal ? String(c.min_subtotal) : '',
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '',
      max_redemptions: c.max_redemptions != null ? String(c.max_redemptions) : '',
      active: c.active,
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const submit = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const base: CouponInput = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        min_subtotal: form.min_subtotal === '' ? 0 : Number(form.min_subtotal),
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        max_redemptions: form.max_redemptions === '' ? null : Number(form.max_redemptions),
        active: form.active,
      };
      if (editing) {
        const { code, ...updates } = base;
        void code;
        const updated = await updateCouponAdmin(editing.code, updates);
        setCoupons((prev) => prev.map((c) => (c.code === editing.code ? updated : c)));
      } else {
        const created = await createCouponAdmin(base);
        setCoupons((prev) => [created, ...prev]);
      }
      closeForm();
    } catch (e) {
      setFormError((e as Error)?.message || 'Gagal menyimpan kupon');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: AdminCoupon) => {
    try {
      const updated = await updateCouponAdmin(c.code, { active: !c.active });
      setCoupons((prev) => prev.map((x) => (x.code === c.code ? updated : x)));
    } catch (e) {
      setError((e as Error)?.message || 'Gagal mengubah status kupon');
    }
  };

  const remove = async (c: AdminCoupon) => {
    if (!confirm(`Hapus kupon ${c.code}?`)) return;
    try {
      await deleteCouponAdmin(c.code);
      setCoupons((prev) => prev.filter((x) => x.code !== c.code));
    } catch (e) {
      setError((e as Error)?.message || 'Gagal menghapus kupon');
    }
  };

  if (!configured) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <Database className="mx-auto h-8 w-8 text-neutral-300" />
        <h2 className="mt-3 font-clash text-lg font-semibold text-neutral-900">Kupon butuh Supabase</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
          Data kupon disimpan di Supabase. Isi environment variable Supabase (termasuk
          SUPABASE_SERVICE_ROLE_KEY) untuk mengelola kupon.
        </p>
      </div>
    );
  }

  if (!loaded || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-neutral-400">
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat kupon...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-sage-primary" />
          <h2 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
            Manajemen Kupon
          </h2>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-sage-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Kupon Baru
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {coupons.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-400">
            Belum ada kupon. Klik &quot;Kupon Baru&quot; untuk menambah.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-100 text-[11px] uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Min. belanja</th>
                  <th className="px-4 py-3 font-semibold">Kedaluwarsa</th>
                  <th className="px-4 py-3 font-semibold">Redemptions</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {coupons.map((c) => {
                  const expired = c.expires_at ? new Date(c.expires_at).getTime() < Date.now() : false;
                  const quotaFull =
                    c.max_redemptions != null && c.times_redeemed >= c.max_redemptions;
                  return (
                    <tr key={c.code} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono font-semibold text-neutral-900">{c.code}</td>
                      <td className="px-4 py-3 text-neutral-700">
                        {c.type === 'percent' ? `${c.value}%` : currency(c.value)}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {c.min_subtotal ? currency(c.min_subtotal) : '\u2014'}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {c.expires_at ? (
                          <span className={expired ? 'text-red-600' : ''}>
                            {new Date(c.expires_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        ) : (
                          '\u2014'
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {c.times_redeemed}
                        {c.max_redemptions != null ? ` / ${c.max_redemptions}` : ''}
                      </td>
                      <td className="px-4 py-3">
                        {!c.active ? (
                          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                            Nonaktif
                          </span>
                        ) : expired ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                            Kedaluwarsa
                          </span>
                        ) : quotaFull ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Kuota habis
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            Aktif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleActive(c)}
                            title={c.active ? 'Nonaktifkan' : 'Aktifkan'}
                            className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            title="Edit"
                            className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove(c)}
                            title="Hapus"
                            className="rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
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
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-clash text-lg font-semibold uppercase tracking-wider text-neutral-900">
                {editing ? 'Edit Kupon' : 'Kupon Baru'}
              </h3>
              <button
                onClick={closeForm}
                className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Kode
                </label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  disabled={!!editing}
                  placeholder="mis. WELCOME10"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm uppercase focus:border-sage-primary focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Tipe
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sage-primary focus:outline-none"
                  >
                    <option value="percent">Persentase (%)</option>
                    <option value="fixed">Nominal ($)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {form.type === 'percent' ? 'Nilai (%)' : 'Nilai ($)'}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === 'percent' ? '10' : '50'}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sage-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Min. belanja ($)
                  </label>
                  <input
                    type="number"
                    value={form.min_subtotal}
                    onChange={(e) => setForm({ ...form, min_subtotal: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sage-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Kuota (opsional)
                  </label>
                  <input
                    type="number"
                    value={form.max_redemptions}
                    onChange={(e) => setForm({ ...form, max_redemptions: e.target.value })}
                    placeholder="Tak terbatas"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sage-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Kedaluwarsa (opsional)
                </label>
                <input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sage-primary focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                Kupon aktif
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeForm}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-sage-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? 'Simpan' : 'Buat kupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
