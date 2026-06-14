'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchReviewsDb, addReviewDb, type Review } from '@/lib/db/reviews';
import { toast } from '@/store/toastStore';

const dbMode = isSupabaseConfigured();
const LOCAL_KEY = 'las-reviews';

function readLocalReviews(productId: string): Review[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const all: Review[] = raw ? JSON.parse(raw) : [];
    return all
      .filter((r) => r.product_id === productId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch {
    return [];
  }
}

function writeLocalReview(review: Review) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const all: Review[] = raw ? JSON.parse(raw) : [];
    all.unshift(review);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${dim} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
        />
      ))}
    </div>
  );
}

interface Props {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: Props) {
  const user = useAuthStore((s) => s.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    if (dbMode) {
      try {
        const data = await fetchReviewsDb(productId);
        setReviews(data);
      } catch (e) {
        console.error('[reviews] gagal memuat:', e);
        setReviews([]);
      }
    } else {
      setReviews(readLocalReviews(productId));
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    const count = reviews.length;
    const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { count, average };
  }, [reviews]);

  const needsSignIn = dbMode && !user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsSignIn) {
      toast.info('Sign in to write a review');
      return;
    }
    if (rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a short review');
      return;
    }
    setSubmitting(true);
    try {
      if (dbMode) {
        const created = await addReviewDb({
          productId,
          author: author.trim() || user?.name || 'Anonymous',
          rating,
          comment,
        });
        setReviews((prev) => [created, ...prev]);
      } else {
        const local: Review = {
          id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          product_id: productId,
          user_id: user?.id || 'local',
          author: author.trim() || user?.name || 'Anonymous',
          rating: Math.min(5, Math.max(1, Math.round(rating))),
          comment: comment.trim(),
          created_at: new Date().toISOString(),
        };
        writeLocalReview(local);
        setReviews((prev) => [local, ...prev]);
      }
      toast.success('Thanks for your review!');
      setRating(0);
      setHover(0);
      setAuthor('');
      setComment('');
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-neutral-900">Reviews</h2>
        <div className="flex items-center gap-2">
          <Stars value={stats.average} size="lg" />
          <span className="text-sm text-neutral-600">
            {stats.count > 0
              ? `${stats.average.toFixed(1)} \u00b7 ${stats.count} review${stats.count !== 1 ? 's' : ''}`
              : 'No reviews yet'}
          </span>
        </div>
      </div>

      {/* Review form */}
      {needsSignIn ? (
        <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">
          <Link href="/signin" className="font-semibold text-neutral-900 underline">
            Sign in
          </Link>{' '}
          to write a review for this product.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-neutral-50 p-4">
          <p className="text-sm font-semibold text-neutral-900">Write a review</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${i} star${i !== 1 ? 's' : ''}`}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 transition ${i <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                />
              </button>
            ))}
          </div>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={user?.name ? `Name (default: ${user.name})` : 'Your name (optional)'}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={`What did you think of the ${productName}?`}
            className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-neutral-500">Be the first to review this product.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900">{r.author}</p>
                <span className="text-xs text-neutral-400">
                  {new Date(r.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="mt-1">
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
