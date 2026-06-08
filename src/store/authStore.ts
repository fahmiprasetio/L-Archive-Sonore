import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface UserSession {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
  isMockMode: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  init: () => Promise<void>;
}

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    url &&
    url !== 'your_supabase_project_url' &&
    url.trim() !== '' &&
    anonKey &&
    anonKey !== 'your_supabase_anon_key' &&
    anonKey.trim() !== ''
  );
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isMockMode: !isSupabaseConfigured(),

  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    const { isMockMode } = get();

    if (!isMockMode) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

        if (error) throw error;

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || name,
            },
          });
        }
      } catch (err: any) {
        set({ error: err.message || 'Failed to sign up.' });
        throw err;
      } finally {
        set({ loading: false });
      }
    } else {
      // Mock signup logic (using localStorage)
      try {
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const exists = mockUsers.find((u: any) => u.email === email);
        if (exists) {
          throw new Error('User already exists');
        }

        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          password, // stored in plain text for simple development mock only!
          name,
        };

        mockUsers.push(newUser);
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));

        const sessionUser: UserSession = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        };

        localStorage.setItem('mock_session', JSON.stringify(sessionUser));
        set({ user: sessionUser });
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      } finally {
        set({ loading: false });
      }
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { isMockMode } = get();

    if (!isMockMode) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || 'User',
            },
          });
        }
      } catch (err: any) {
        set({ error: err.message || 'Failed to sign in.' });
        throw err;
      } finally {
        set({ loading: false });
      }
    } else {
      // Mock signin logic
      try {
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const user = mockUsers.find((u: any) => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password');
        }

        const sessionUser: UserSession = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        localStorage.setItem('mock_session', JSON.stringify(sessionUser));
        set({ user: sessionUser });
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      } finally {
        set({ loading: false });
      }
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    const { isMockMode } = get();

    if (!isMockMode) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null });
      } catch (err: any) {
        set({ error: err.message || 'Failed to sign out.' });
        throw err;
      } finally {
        set({ loading: false });
      }
    } else {
      localStorage.removeItem('mock_session');
      set({ user: null, loading: false });
    }
  },

  init: async () => {
    const { isMockMode } = get();

    if (!isMockMode) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
            },
            loading: false,
          });
        } else {
          set({ user: null, loading: false });
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange((_event: any, session: any) => {
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
              },
            });
          } else {
            set({ user: null });
          }
        });
      } catch (err) {
        set({ user: null, loading: false });
      }
    } else {
      try {
        const sessionStr = localStorage.getItem('mock_session');
        if (sessionStr) {
          set({ user: JSON.parse(sessionStr), loading: false });
        } else {
          set({ user: null, loading: false });
        }
      } catch (err) {
        set({ user: null, loading: false });
      }
    }
  },
}));
