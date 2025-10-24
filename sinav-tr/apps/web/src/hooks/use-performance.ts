import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function usePerformanceReport(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
  return useQuery({
    queryKey: ['performance', period],
    queryFn: () => apiClient.getPerformanceReport(period),
  });
}

export function useLearningPath() {
  return useQuery({
    queryKey: ['learning-path'],
    queryFn: () => apiClient.getLearningPath(),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => apiClient.getRecommendations(),
  });
}
