"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/modules/auth/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Prevents aggressive refetching on click-away
            staleTime: 60 * 1000,        // Cache items for 1 minute before refetching
            retry: 1,                    // Only retry once on failure
          },
        },
      })
  );

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      document.cookie = `token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  }, [accessToken, isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
