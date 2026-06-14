'use client';

import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

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
  const reviews = useReviewStore((s) => s.reviews);
  const addReview = useReviewStore((s) => s.addReview);
  const user = useAuthStore((s) => s.user);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const list = useMemo(
    () =>
      reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reviews, productId]
  );
  const stats = useMemo(() => {
    const count = list.length;
    const average = count > 0 ? list.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { count, average };
  }, [list]);

  const displayList = mounted ? list : [];
  const displayStats = mounted ? stats : { count: 0, average: 0 };

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a short review');
      return;
    }
    addReview({
      productId,
      author: author.trim() || user?.name || 'Anonymous',
      rating,
      comment,
    });
    toast.success('Thanks for your review!');
    setRating(0);
    setHover(0);
    setAuthor('');
    setComment('');
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-neutral-900">Reviews</h2>
        <div className="flex items-center gap-2">
          <Stars value={displayStats.average} size="lg" />
          <span className="text-sm text-neutral-600">
            {displayStats.count > 0
              ? `${displayStats.average.toFixed(1)} \u00b7 ${displayStats.count} review${displayStats.count !== 1 ? 's' : ''}`
              : 'No reviews yet'}
          </span>
        </div>
      </div>

      {/* Review form */}
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
          className="rounded bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Submit review
        </button>
      </form>

      {/* Review list */}
      <div className="space-y-4">
        {displayList.length === 0 ? (
          <p className="text-sm text-neutral-500">Be the first to review this product.</p>
        ) : (
          displayList.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900">{r.author}</p>
                <span className="text-xs text-neutral-400">
                  {new Date(r.createdAt).toLocaleDateString('id-ID')}
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
