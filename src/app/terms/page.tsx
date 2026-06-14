import Link from 'next/link';
import {
  ArrowLeft,
  ScrollText,
  FileText,
  ShieldCheck,
  Tag,
  CreditCard,
  Truck,
  RotateCcw,
  Copyright,
  Scale,
  RefreshCw,
  Mail,
} from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions governing your use of L’Archive Sonore.',
  alternates: { canonical: '/terms' },
};

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. Acceptance of Terms',
    body: 'By accessing or using L’Archive Sonore, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.',
  },
  {
    id: 'use-of-site',
    icon: ShieldCheck,
    title: '2. Use of the Site',
    body: 'You agree to use the site only for lawful purposes and not to interfere with its operation or attempt to access areas you are not authorized to access. You are responsible for keeping your account credentials secure.',
  },
  {
    id: 'products-pricing',
    icon: Tag,
    title: '3. Products & Pricing',
    body: 'We strive to display accurate product descriptions, availability, and pricing. Prices are listed in USD and may change without notice. In the rare event of a pricing or stock error, we reserve the right to cancel affected orders and issue a full refund.',
  },
  {
    id: 'orders-payment',
    icon: CreditCard,
    title: '4. Orders & Payment',
    body: 'An order is confirmed once payment is successfully completed through our payment gateway (Midtrans). We reserve the right to refuse or cancel any order at our discretion, for example in cases of suspected fraud or stock unavailability.',
  },
  {
    id: 'shipping',
    icon: Truck,
    title: '5. Shipping & Delivery',
    body: 'Estimated delivery times are provided for reference and are not guaranteed. Risk of loss passes to you upon delivery to the carrier. Please ensure your shipping address is accurate at checkout.',
  },
  {
    id: 'returns-refunds',
    icon: RotateCcw,
    title: '6. Returns & Refunds',
    body: 'Eligible items may be returned within the period stated at the time of purchase, provided they are in original condition. Refunds are issued to the original payment method after the returned item is received and inspected.',
  },
  {
    id: 'intellectual-property',
    icon: Copyright,
    title: '7. Intellectual Property',
    body: 'All content on this site — including text, images, logos, and design — is the property of L’Archive Sonore and may not be reproduced without permission.',
  },
  {
    id: 'liability',
    icon: Scale,
    title: '8. Limitation of Liability',
    body: 'L’Archive Sonore is not liable for any indirect, incidental, or consequential damages arising from your use of the site or products purchased, to the fullest extent permitted by law.',
  },
  {
    id: 'changes',
    icon: RefreshCw,
    title: '9. Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    id: 'contact',
    icon: Mail,
    title: '10. Contact',
    body: 'Questions about these terms? Email us at hello@larchivesonore.com.',
  },
];

export default function TermsPage() {
  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back Home
        </Link>

        <header className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A4438] to-[#2E3A2C] px-8 py-12 text-[#F4F2EC] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <ScrollText className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#B6CEB4]">
                L’Archive Sonore
              </p>
              <h1 className="font-clash text-4xl font-medium uppercase tracking-wide">
                Terms of Service
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#F4F2EC]/80">
            Please read these terms carefully. They govern your access to and use
            of L’Archive Sonore and every purchase you make with us.
          </p>
          <span className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F4F2EC]/90 ring-1 ring-white/20">
            Last updated: June 2026
          </span>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                On this page
              </p>
              <nav className="flex flex-col gap-1 text-sm">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-lg px-3 py-1.5 text-neutral-500 transition hover:bg-[#EFE6D3] hover:text-[#2E3A2C]"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-sage-secondary hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFE6D3] text-[#3A4438]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-neutral-900">
                        {s.title}
                      </h2>
                      <p className="leading-relaxed text-neutral-600">{s.body}</p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-[#EFE6D3] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3A4438] text-[#F4F2EC]">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-clash text-xl uppercase tracking-wide text-[#2E3A2C]">
            Need clarification?
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            We are here to answer any questions about these terms.
          </p>
          <a
            href="mailto:hello@larchivesonore.com"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#3A4438] px-6 py-3 text-sm font-semibold text-[#F4F2EC] transition hover:bg-[#2E3A2C]"
          >
            <Mail className="h-4 w-4" /> hello@larchivesonore.com
          </a>
        </div>
      </div>
    </div>
  );
}
