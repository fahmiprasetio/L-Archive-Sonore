import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Settings,
  CreditCard,
  Lock,
  Cookie,
  UserCheck,
  Mail,
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How L’Archive Sonore collects, uses, and protects your personal data.',
  alternates: { canonical: '/privacy' },
};

const sections = [
  {
    id: 'information-we-collect',
    icon: Database,
    title: '1. Information We Collect',
    body: 'When you create an account, place an order, or contact us, we may collect your name, email address, shipping address, and order details. Payment is processed by our payment provider; we do not store your full card or banking credentials on our servers.',
  },
  {
    id: 'how-we-use',
    icon: Settings,
    title: '2. How We Use Your Information',
    body: 'We use your information to process and deliver orders, manage your account, provide customer support, prevent fraud, and — only with your consent — send occasional updates about new arrivals and offers.',
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: '3. Payments',
    body: 'Payments are handled securely through Midtrans. Your transaction is encrypted and processed directly by the payment gateway. L’Archive Sonore only receives the order status and a transaction reference.',
  },
  {
    id: 'data-security',
    icon: Lock,
    title: '4. Data Storage & Security',
    body: 'Account and order data are stored on Supabase with row-level security so that each customer can only access their own records. We apply reasonable technical and organizational measures to protect your data against unauthorized access.',
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: '5. Cookies',
    body: 'We use essential cookies and local storage to keep you signed in and to remember the items in your cart. These are required for the site to function and do not track you across other websites.',
  },
  {
    id: 'your-rights',
    icon: UserCheck,
    title: '6. Your Rights',
    body: 'You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us using the details below and we will respond within a reasonable timeframe.',
  },
  {
    id: 'contact',
    icon: Mail,
    title: '7. Contact',
    body: 'For any privacy-related questions, email us at hello@larchivesonore.com.',
  },
];

export default function PrivacyPage() {
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
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#B6CEB4]">
                L’Archive Sonore
              </p>
              <h1 className="font-clash text-4xl font-medium uppercase tracking-wide">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#F4F2EC]/80">
            We respect your privacy. This policy explains what we collect, why we
            collect it, and the choices you have over your personal data.
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
            Questions about your data?
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            We are here to help with any privacy concerns.
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
