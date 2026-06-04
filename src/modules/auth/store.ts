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
      setAuth: (response) => set({ 
        user: response.user, 
        accessToken: response.token, 
        isAuthenticated: true 
      }),
      setAccessToken: (token) => set({ 
        accessToken: token 
      }),
      clearAuth: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'meetme_auth_session', // unique storage key in localStorage
    }
  )
);
