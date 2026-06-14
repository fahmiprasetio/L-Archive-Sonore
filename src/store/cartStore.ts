import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

// Batas stok sebuah produk (Infinity bila stok tidak diketahui).
function stockCap(product: Pick<Product, 'stock'>): number {
  return typeof product.stock === 'number' ? product.stock : Infinity;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    set((state) => {
      const cap = stockCap(product);
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, cap);
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.max(1, nextQty) }
              : item
          ),
        };
      }
      const nextQty = Math.min(quantity, cap);
      if (nextQty < 1) return state; // stok habis, tidak menambah apa pun
      return { items: [...state.items, { product, quantity: nextQty }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id !== productId) return item;
        const cap = stockCap(item.product);
        return { ...item, quantity: Math.min(quantity, cap) };
      }),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
}));
