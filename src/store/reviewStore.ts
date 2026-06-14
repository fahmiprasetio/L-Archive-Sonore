import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO string
}

interface ReviewState {
  reviews: Review[];
  addReview: (input: {
    productId: string;
    author: string;
    rating: number;
    comment: string;
  }) => void;
  removeReview: (id: string) => void;
}

// Disimpan di localStorage (key: las-reviews) lewat middleware persist.
export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: ({ productId, author, rating, comment }) =>
        set((s) => ({
          reviews: [
            {
              id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              productId,
              author: author.trim() || 'Anonymous',
              rating: Math.min(5, Math.max(1, Math.round(rating))),
              comment: comment.trim(),
              createdAt: new Date().toISOString(),
            },
            ...s.reviews,
          ],
        })),
      removeReview: (id) =>
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),
    }),
    { name: 'las-reviews' }
  )
);
