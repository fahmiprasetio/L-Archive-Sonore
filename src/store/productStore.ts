import { create } from 'zustand';
import type { Product } from '@/types';
import { PRODUCTS } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchProductsDb,
  createProductDb,
  updateProductDb,
  deleteProductDb,
} from '@/lib/db/products';
import type { ProductInput } from '@/lib/db/products';

export type { ProductInput };

const LOCAL_KEY = 'las-products-store-v2';
const dbMode = isSupabaseConfigured();

function readLocal(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS as Product[];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Product[];
    }
  } catch {
    // ignore
  }
  return PRODUCTS as Product[];
}

function writeLocal(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

interface ProductState {
  products: Product[];
  loading: boolean;
  loaded: boolean;
  dbMode: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<void>;
  updateProduct: (id: string, updates: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  loaded: false,
  dbMode,

  loadProducts: async () => {
    if (get().loading) return;
    set({ loading: true });
    if (dbMode) {
      try {
        const products = await fetchProductsDb();
        set({ products, loaded: true, loading: false });
      } catch (e) {
        console.error('[productStore] gagal memuat dari Supabase, fallback ke lokal:', e);
        set({ products: readLocal(), loaded: true, loading: false });
      }
    } else {
      set({ products: readLocal(), loaded: true, loading: false });
    }
  },

  addProduct: async (input) => {
    if (dbMode) {
      const created = await createProductDb(input);
      set((s) => ({ products: [...s.products, created] }));
    } else {
      const newProduct: Product = {
        ...input,
        id: `p_${Date.now()}`,
        stock: input.stock ?? 0,
        created_at: new Date().toISOString(),
      };
      const products = [...get().products, newProduct];
      writeLocal(products);
      set({ products });
    }
  },

  updateProduct: async (id, updates) => {
    if (dbMode) {
      const updated = await updateProductDb(id, updates);
      set((s) => ({ products: s.products.map((p) => (p.id === id ? updated : p)) }));
    } else {
      const products = get().products.map((p) => (p.id === id ? { ...p, ...updates } : p));
      writeLocal(products);
      set({ products });
    }
  },

  deleteProduct: async (id) => {
    if (dbMode) {
      await deleteProductDb(id);
      set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
    } else {
      const products = get().products.filter((p) => p.id !== id);
      writeLocal(products);
      set({ products });
    }
  },

  resetProducts: async () => {
    if (dbMode) {
      set({ loaded: false });
      await get().loadProducts();
    } else {
      const products = PRODUCTS as Product[];
      writeLocal(products);
      set({ products });
    }
  },
}));
