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
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (response) => {
        if (typeof window !== 'undefined') {
          document.cookie = `token=${response.token}; path=/; max-age=604800; SameSite=Lax`;
          
          if (response.user && response.user.email) {
            const emailKey = response.user.email.replace(/[^a-zA-Z0-9]/g, "_");
            const keysToRestore = [
              { key: "favourite_partners", backupKey: `backup_favourite_partners_${emailKey}` },
              { key: "hire_my_partner_bookings", backupKey: `backup_bookings_${emailKey}` },
              { key: "hire_my_partner_requests", backupKey: `backup_requests_${emailKey}` },
              { key: "meetme_notification_prefs", backupKey: `backup_notification_prefs_${emailKey}` },
              { key: "user_mood", backupKey: `backup_user_mood_${emailKey}` },
            ];

            keysToRestore.forEach(({ key, backupKey }) => {
              const val = localStorage.getItem(backupKey);
              if (val !== null) {
                localStorage.setItem(key, val);
              } else {
                localStorage.removeItem(key);
              }
            });
            
            window.dispatchEvent(new Event("partnerStatusChange"));
            window.dispatchEvent(new Event("partner_profile_updated"));
          }
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
        const state = get();
        const currentUser = state.user;
        
        if (currentUser && currentUser.email && typeof window !== 'undefined') {
          const emailKey = currentUser.email.replace(/[^a-zA-Z0-9]/g, "_");
          const keysToBackup = [
            { key: "favourite_partners", backupKey: `backup_favourite_partners_${emailKey}` },
            { key: "hire_my_partner_bookings", backupKey: `backup_bookings_${emailKey}` },
            { key: "hire_my_partner_requests", backupKey: `backup_requests_${emailKey}` },
            { key: "meetme_notification_prefs", backupKey: `backup_notification_prefs_${emailKey}` },
            { key: "user_mood", backupKey: `backup_user_mood_${emailKey}` },
          ];

          keysToBackup.forEach(({ key, backupKey }) => {
            const val = localStorage.getItem(key);
            if (val !== null) {
              localStorage.setItem(backupKey, val);
            }
            localStorage.removeItem(key);
          });
          
          localStorage.removeItem("pending_booking");
          
          window.dispatchEvent(new Event("partnerStatusChange"));
          window.dispatchEvent(new Event("partner_profile_updated"));
        }

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
