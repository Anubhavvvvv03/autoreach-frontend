import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMe } from '../services/authService';
import type { User } from '../services/authService';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token, user) => {
        localStorage.setItem('ar_token', token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('ar_token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      initialize: async () => {
        const token = localStorage.getItem('ar_token');
        if (!token) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await getMe();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Session initialization failed:', error);
          localStorage.removeItem('ar_token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'autoreach-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
