'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

// Batas stok produk (Infinity bila stok tidak diketahui).
function stockOf(stock?: number): number {
  return typeof stock === 'number' ? stock : Infinity;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Item yang bermasalah stok: habis (0) atau kuantitas melebihi stok.
  const stockIssues = items.filter((item) => {
    const cap = stockOf(item.product.stock);
    return cap <= 0 || item.quantity > cap;
  });
  const hasStockIssue = stockIssues.length > 0;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-6">
        <div className="flex justify-center text-neutral-400">
          <ShoppingBag className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
        <p className="text-neutral-600 max-w-sm mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our instruments to find something special!
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-800 transition">
          <ArrowLeft className="h-4 w-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-neutral-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-800 transition font-semibold"
        >
          Clear Cart
        </button>
      </div>

      {hasStockIssue && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>
            Beberapa item melebihi stok yang tersedia atau sedang habis. Sesuaikan kuantitas atau hapus item tersebut sebelum melanjutkan ke pembayaran.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const cap = stockOf(item.product.stock);
            const knownStock = typeof item.product.stock === 'number';
            const outOfStock = cap <= 0;
            const overStock = item.quantity > cap;
            const atMax = item.quantity >= cap;
            return (
              <div
                key={item.product.id}
                className={`flex items-center gap-4 bg-white border rounded-lg p-4 ${
                  outOfStock || overStock ? 'border-amber-300' : 'border-gray-200'
                }`}
              >
                {/* Product Image */}
                <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                  {item.product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className={`h-full w-full object-cover ${outOfStock ? 'grayscale opacity-60' : ''}`}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`} className="hover:underline">
                    <h3 className="font-semibold text-neutral-900 truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  <span className="text-xs text-gray-500 uppercase">
                    {item.product.category}
                  </span>
                  <p className="mt-1 font-bold text-neutral-950">
                    ${item.product.price.toLocaleString('en-US')}
                  </p>
                  {knownStock && outOfStock && (
                    <p className="mt-1 text-xs font-semibold text-red-600">Stok habis</p>
                  )}
                  {knownStock && !outOfStock && overStock && (
                    <p className="mt-1 text-xs font-semibold text-amber-600">
                      Hanya tersisa {cap} item
                    </p>
                  )}
                  {knownStock && !outOfStock && !overStock && cap <= 5 && (
                    <p className="mt-1 text-xs text-amber-600">Sisa stok: {cap}</p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-gray-100 text-neutral-600 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 font-semibold text-neutral-900 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={atMax}
                    className="p-1.5 hover:bg-gray-100 text-neutral-600 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    aria-label="Increase quantity"
                    title={atMax ? 'Sudah mencapai batas stok' : undefined}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 transition"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 h-fit">
          <h2 className="text-xl font-bold text-neutral-900 border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Total Items</span>
              <span className="font-semibold text-neutral-900">{totalItems}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${totalPrice.toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-neutral-900">
              <span>Total Price</span>
              <span>${totalPrice.toLocaleString('en-US')}</span>
            </div>
          </div>

          {hasStockIssue ? (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center rounded bg-neutral-300 py-3 font-semibold text-white cursor-not-allowed"
              title="Perbaiki masalah stok terlebih dahulu"
            >
              Sesuaikan stok dulu
            </button>
          ) : (
            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center rounded bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-800 transition text-center"
            >
              Proceed to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
