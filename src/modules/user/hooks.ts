import { useState, useEffect } from 'react';
import { userApi } from './api';
import { User } from './types';
import { useAuthStore } from '@/modules/auth/store';
import { toast } from '@/components/ui/toastStore';

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);

  // You can fetch more user data if needed here
  return { user, isAuthenticated, loading };
};

export const useUser = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const data = await userApi.getUserById(userId);
        setUser(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, isLoading };
};
