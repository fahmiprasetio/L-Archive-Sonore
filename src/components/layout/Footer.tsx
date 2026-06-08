import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-neutral-50 px-6 py-10 mt-auto">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Brand */}
        <div className="space-y-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
            L&apos;Archive Sonore
          </Link>
          <p className="text-sm text-neutral-600 max-w-xs leading-relaxed">
            The premium collection of legendary instruments for discerning musicians and creators worldwide.
          </p>
        </div>

        {/* Middle Column: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>
              <Link href="/" className="hover:text-neutral-900 transition">
                Instrument Catalog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-neutral-900 transition">
                About the Archive
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Contact Placeholder */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>
              <span className="block font-medium">Customer Service</span>
              <span className="text-xs">support@larchivesonore.com</span>
            </li>
            <li>
              <span className="block font-medium">Hours</span>
              <span className="text-xs">Mon - Fri: 9:00 AM - 6:00 PM EST</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>&copy; {new Date().getFullYear()} L&apos;Archive Sonore. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
