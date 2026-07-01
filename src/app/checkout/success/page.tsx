'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight, Mail } from 'lucide-react';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id');

  return (
    <div className="mx-auto max-w-lg py-16 px-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-11 w-11 text-emerald-500" />
      </div>

      <h1 className="mt-6 font-clash text-3xl font-medium uppercase tracking-wide text-neutral-900">
        Thank You for Your Order
      </h1>
      <p className="mt-3 text-neutral-600 leading-relaxed">
        Your payment was received and your order is being processed. A confirmation
        has been sent to your email.
      </p>

      {orderId && (
        <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Order ID
          </span>
          <span className="mt-1 font-mono text-sm font-semibold text-neutral-900">
            {orderId}
          </span>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Package className="h-4 w-4" /> View My Orders
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {orderId && (
        <p className="mt-6 text-sm text-neutral-600">
          Checkout sebagai tamu?{' '}
          <Link
            href={`/orders/track?order_id=${encodeURIComponent(orderId)}`}
            className="font-semibold text-neutral-900 underline hover:text-neutral-700"
          >
            Lacak pesanan Anda
          </Link>{' '}
          kapan saja memakai Order ID di atas.
        </p>
      )}

      <p className="mt-10 inline-flex items-center gap-2 text-xs text-neutral-400">
        <Mail className="h-3.5 w-3.5" />
        Need help? hello@larchivesonore.com
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-neutral-400">Loading...</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
