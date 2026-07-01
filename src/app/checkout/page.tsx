"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/store/toastStore';
import { calcSummaryWithDiscount, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { ArrowLeft, CreditCard, Tag, X } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    snap: any;
  }
}

// Snap script mengikuti mode Midtrans (sandbox saat dev, production saat live).
const SNAP_SRC =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  // Kupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null
  );
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const discount = appliedCoupon?.discount ?? 0;
  const summary = calcSummaryWithDiscount(totalPrice, discount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code || applyingCoupon) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: totalPrice }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setAppliedCoupon(null);
        setCouponError(data.error || 'Kupon tidak valid');
        return;
      }
      setAppliedCoupon({ code: data.code, discount: data.discount });
      toast.success(`Kupon ${data.code} diterapkan!`);
    } catch {
      setCouponError('Gagal memeriksa kupon. Coba lagi.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    setLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          if (token) headers.Authorization = `Bearer ${token}`;
        } catch {
          // anonymous checkout
        }
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items,
          customerDetails: formData,
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            clearCart();
            toast.success('Payment successful! Redirecting to your order...');
            const orderId = result?.order_id || data.order_id || '';
            router.push(`/checkout/success?order_id=${encodeURIComponent(orderId)}`);
          },
          onPending: function () {
            toast.info('Waiting for your payment to be completed.');
          },
          onError: function (result: any) {
            console.error('Payment failed:', result);
            toast.error('Payment failed. Please try again.');
          },
          onClose: function () {
            toast.info('Payment window closed before completion.');
          },
        });
      } else {
        throw new Error('No snap token received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
        <p className="text-neutral-600">You must add items to your cart before checking out.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-800 transition">
          <ArrowLeft className="h-4 w-4" /> Go to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <Link href="/cart" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-extrabold text-neutral-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b border-gray-100 pb-3">
            Shipping Information
          </h2>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                Shipping Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={4}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none resize-none"
                placeholder="123 Music Street, Sound City"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-800 transition disabled:opacity-50"
            >
              <CreditCard className="h-5 w-5" />
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 h-fit">
          <h2 className="text-xl font-bold text-neutral-900 border-b border-gray-100 pb-3">
            Review Order
          </h2>

          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product.id} className="py-3 flex justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} x ${item.product.price}
                  </p>
                </div>
                <span className="font-bold text-sm text-neutral-900 flex-shrink-0">
                  ${(item.product.price * item.quantity).toLocaleString('en-US')}
                </span>
              </div>
            ))}
          </div>

          {/* Kupon */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <label htmlFor="coupon" className="flex items-center gap-1.5 text-sm font-medium text-neutral-700">
              <Tag className="h-4 w-4" /> Kode Kupon
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2">
                <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="inline-flex items-center gap-1 text-xs text-green-700 hover:text-green-900"
                >
                  <X className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="mis. WELCOME10"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={applyingCoupon || !couponInput.trim()}
                  className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {applyingCoupon ? '...' : 'Terapkan'}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-600">{couponError}</p>}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${summary.subtotal.toLocaleString('en-US')}</span>
            </div>
            {summary.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Diskon{appliedCoupon ? ` (${appliedCoupon.code})` : ''}</span>
                <span className="font-semibold">-${summary.discount.toLocaleString('en-US')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              {summary.shipping === 0 ? (
                <span className="text-green-600 font-semibold">Free</span>
              ) : (
                <span className="font-semibold text-neutral-900">${summary.shipping.toLocaleString('en-US')}</span>
              )}
            </div>
            {summary.shipping > 0 && (
              <p className="text-xs text-sage-primary">
                Tambah ${(FREE_SHIPPING_THRESHOLD - (summary.subtotal - summary.discount)).toLocaleString('en-US')} lagi untuk gratis ongkir
              </p>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Tax (PPN 11%)</span>
              <span className="font-semibold text-neutral-900">${summary.tax.toLocaleString('en-US')}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-neutral-900">
              <span>Total Amount</span>
              <span>${summary.total.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>
      </div>
      <Script
        src={SNAP_SRC}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  );
}
