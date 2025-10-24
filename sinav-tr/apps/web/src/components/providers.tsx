'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const { loadUser, isAuthenticated } = useAuth();

  useEffect(() => {
    // Load user on mount
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    // Connect WebSocket if authenticated
    if (isAuthenticated) {
      const socket = apiClient.connectSocket();
      
      // Setup listeners
      socket?.on('notification', (data: any) => {
        console.log('Notification received:', data);
        // You can show toast notification here
      });

      return () => {
        apiClient.disconnectSocket();
      };
    }
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
