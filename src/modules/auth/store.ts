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
  updateUserAvatar: (avatarUrl: string) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
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
      updateUserAvatar: (avatarUrl) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              avatar: avatarUrl
            }
          };
        });
      },
      updateUserProfile: (profileData) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              ...profileData
            }
          };
        });
      },
    }),
    {
      name: 'meetme_auth_session', // unique storage key in localStorage
    }
  )
);
