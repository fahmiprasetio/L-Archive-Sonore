import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | L\u2019Archive Sonore',
  description: 'How L\u2019Archive Sonore collects, uses, and protects your personal data.',
};

const sections = [
  {
    title: '1. Information We Collect',
    body: 'When you create an account, place an order, or contact us, we may collect your name, email address, shipping address, and order details. Payment is processed by our payment provider; we do not store your full card or banking credentials on our servers.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to process and deliver orders, manage your account, provide customer support, prevent fraud, and — only with your consent — send occasional updates about new arrivals and offers.',
  },
  {
    title: '3. Payments',
    body: 'Payments are handled securely through Midtrans. Your transaction is encrypted and processed directly by the payment gateway. L\u2019Archive Sonore only receives the order status and a transaction reference.',
  },
  {
    title: '4. Data Storage & Security',
    body: 'Account and order data are stored on Supabase with row-level security so that each customer can only access their own records. We apply reasonable technical and organizational measures to protect your data against unauthorized access.',
  },
  {
    title: '5. Cookies',
    body: 'We use essential cookies and local storage to keep you signed in and to remember the items in your cart. These are required for the site to function and do not track you across other websites.',
  },
  {
    title: '6. Your Rights',
    body: 'You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us using the details below and we will respond within a reasonable timeframe.',
  },
  {
    title: '7. Contact',
    body: 'For any privacy-related questions, email us at hello@larchivesonore.com.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back Home
      </Link>

      <header className="mt-6 border-b border-gray-200 pb-6">
        <h1 className="font-clash text-4xl font-medium uppercase tracking-wide text-neutral-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Last updated: June 2026</p>
      </header>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title} className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900">{s.title}</h2>
            <p className="leading-relaxed text-neutral-600">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm text-neutral-600">
          Questions about your data? Reach us at{' '}
          <a href="mailto:hello@larchivesonore.com" className="font-semibold text-sage-primary hover:underline">
            hello@larchivesonore.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
