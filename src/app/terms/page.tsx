import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | L\u2019Archive Sonore',
  description: 'The terms and conditions governing your use of L\u2019Archive Sonore.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using L\u2019Archive Sonore, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.',
  },
  {
    title: '2. Use of the Site',
    body: 'You agree to use the site only for lawful purposes and not to interfere with its operation or attempt to access areas you are not authorized to access. You are responsible for keeping your account credentials secure.',
  },
  {
    title: '3. Products & Pricing',
    body: 'We strive to display accurate product descriptions, availability, and pricing. Prices are listed in USD and may change without notice. In the rare event of a pricing or stock error, we reserve the right to cancel affected orders and issue a full refund.',
  },
  {
    title: '4. Orders & Payment',
    body: 'An order is confirmed once payment is successfully completed through our payment gateway (Midtrans). We reserve the right to refuse or cancel any order at our discretion, for example in cases of suspected fraud or stock unavailability.',
  },
  {
    title: '5. Shipping & Delivery',
    body: 'Estimated delivery times are provided for reference and are not guaranteed. Risk of loss passes to you upon delivery to the carrier. Please ensure your shipping address is accurate at checkout.',
  },
  {
    title: '6. Returns & Refunds',
    body: 'Eligible items may be returned within the period stated at the time of purchase, provided they are in original condition. Refunds are issued to the original payment method after the returned item is received and inspected.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on this site — including text, images, logos, and design — is the property of L\u2019Archive Sonore and may not be reproduced without permission.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'L\u2019Archive Sonore is not liable for any indirect, incidental, or consequential damages arising from your use of the site or products purchased, to the fullest extent permitted by law.',
  },
  {
    title: '9. Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    title: '10. Contact',
    body: 'Questions about these terms? Email us at hello@larchivesonore.com.',
  },
];

export default function TermsPage() {
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
          Terms of Service
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
          Need clarification? Reach us at{' '}
          <a href="mailto:hello@larchivesonore.com" className="font-semibold text-sage-primary hover:underline">
            hello@larchivesonore.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
