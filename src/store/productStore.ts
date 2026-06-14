import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { PRODUCTS } from '@/lib/products';

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

interface ProductState {
  products: Product[];
  addProduct: (product: ProductInput) => void;
  updateProduct: (id: string, updates: Partial<ProductInput>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: PRODUCTS as Product[],
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: `p_${Date.now()}`,
              created_at: new Date().toISOString(),
            },
          ],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      resetProducts: () => set({ products: PRODUCTS as Product[] }),
    }),
    {
      name: 'las-products-store',
      version: 1,
    }
  )
);
