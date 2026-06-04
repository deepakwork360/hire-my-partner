import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from './api';
import { User } from './types';
import { useAuthStore } from '@/modules/auth/store';
import { toast } from '@/components/ui/toastStore';

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading] = useState(false);

  return { user, isAuthenticated, loading };
};

export const useUser = (userId: string | null) => {
  const { data, isLoading } = useQuery<User | null, Error>({
    queryKey: ['user', userId],
    queryFn: () => userId ? userApi.getUserById(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache user profile for 5 minutes
  });

  return { 
    user: data || null, 
    isLoading 
  };
};
