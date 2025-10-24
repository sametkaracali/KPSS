import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useExams(params?: { type?: string; status?: string }) {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: () => apiClient.getExams(params),
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: ['exam', id],
    queryFn: () => apiClient.getExam(id),
    enabled: !!id,
  });
}

export function useStartExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => apiClient.startExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useSubmitExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, answers }: { sessionId: string; answers: any[] }) =>
      apiClient.submitExam(sessionId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-results'] });
      queryClient.invalidateQueries({ queryKey: ['performance'] });
    },
  });
}

export function useExamResults(userId?: string) {
  return useQuery({
    queryKey: ['exam-results', userId],
    queryFn: () => apiClient.getExamResults(userId),
  });
}
