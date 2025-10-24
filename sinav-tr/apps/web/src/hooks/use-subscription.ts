import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => apiClient.getSubscriptionPlans(),
  });
}

export function useUserSubscription() {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: () => apiClient.getUserSubscription(),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (planId: string) => apiClient.createCheckout(planId),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
}
