import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      alert('Please fill in all shipping fields');
      return;
    }

    setLoading(true);
    try {
      // Placeholder for future Midtrans API call
      console.log('Initiating payment for order:', {
        customer: formData,
        items,
        amount: totalPrice,
      });

      alert('Payment initiation triggered! Connecting to Midtrans soon...');
    } catch (error) {
      console.error('Payment error:', error);
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

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${totalPrice.toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-neutral-900">
              <span>Total Amount</span>
              <span>${totalPrice.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
