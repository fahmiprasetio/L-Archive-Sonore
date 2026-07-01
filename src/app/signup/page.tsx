'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Turnstile, { isCaptchaConfigured } from '@/components/ui/Turnstile';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, error: authError, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    // Captcha bersifat opsional (env-driven). Bila diaktifkan, wajib diselesaikan.
    if (isCaptchaConfigured() && !captchaToken) {
      setLocalError('Selesaikan verifikasi keamanan terlebih dahulu.');
      return;
    }

    try {
      await signUp(email, password, name);
      router.push('/profile');
    } catch {
      // Error sudah ditangani di store (authError).
    }
  };

  const displayError = localError || authError;

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Join L&apos;Archive Sonore to manage your instruments.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {displayError && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-100">
              {displayError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                className="w-full rounded border border-gray-300 px-3 py-2 text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {isCaptchaConfigured() && <Turnstile onToken={setCaptchaToken} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center rounded bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-neutral-600 mt-4">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-neutral-900 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
