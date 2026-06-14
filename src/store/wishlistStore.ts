import { create } from 'zustand';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchWishlistDb, addWishlistDb, removeWishlistDb } from '@/lib/db/wishlist';

const LOCAL_KEY = 'las-wishlist';
const dbMode = isSupabaseConfigured();

function readLocal(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as string[];
    }
  } catch {
    // ignore
  }
  return [];
}

function writeLocal(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface WishlistState {
  ids: string[];
  loaded: boolean;
  loading: boolean;
  dbMode: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<boolean>;
  clear: () => Promise<void>;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  loaded: false,
  loading: false,
  dbMode,

  // Muat wishlist: dari Supabase (RLS per-user) atau localStorage saat mock mode.
  load: async () => {
    if (get().loading) return;
    set({ loading: true });
    if (dbMode) {
      try {
        const ids = await fetchWishlistDb();
        set({ ids, loaded: true, loading: false });
      } catch (e) {
        console.error('[wishlistStore] gagal memuat wishlist:', e);
        set({ ids: [], loaded: true, loading: false });
      }
    } else {
      set({ ids: readLocal(), loaded: true, loading: false });
    }
  },

  // Toggle simpan/hapus dengan update optimistik. Mengembalikan status tersimpan baru.
  toggle: async (id) => {
    const prev = get().ids;
    const saved = prev.includes(id);
    const nextIds = saved ? prev.filter((x) => x !== id) : [id, ...prev];
    set({ ids: nextIds });
    try {
      if (dbMode) {
        if (saved) await removeWishlistDb(id);
        else await addWishlistDb(id);
      } else {
        writeLocal(nextIds);
      }
    } catch (e) {
      set({ ids: prev }); // revert bila gagal
      throw e;
    }
    return !saved;
  },

  clear: async () => {
    const prev = get().ids;
    set({ ids: [] });
    try {
      if (dbMode) {
        await Promise.all(prev.map((id) => removeWishlistDb(id)));
      } else {
        writeLocal([]);
      }
    } catch (e) {
      set({ ids: prev });
      throw e;
    }
  },

  has: (id) => get().ids.includes(id),
}));
