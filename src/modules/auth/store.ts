import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from './types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (response: AuthResponse) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (response) => {
        if (typeof window !== 'undefined') {
          document.cookie = `token=${response.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ 
          user: response.user, 
          accessToken: response.token, 
          isAuthenticated: true 
        });
      },
      setAccessToken: (token) => {
        if (typeof window !== 'undefined') {
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ 
          accessToken: token 
        });
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        }
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'meetme_auth_session', // unique storage key in localStorage
    }
  )
);
