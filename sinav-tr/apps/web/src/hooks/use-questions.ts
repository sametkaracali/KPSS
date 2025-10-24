import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useQuestions(params?: {
  subject?: string;
  topic?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => apiClient.getQuestions(params),
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => apiClient.getQuestion(id),
    enabled: !!id,
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, answerIndex }: { questionId: string; answerIndex: number }) =>
      apiClient.submitAnswer(questionId, answerIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['performance'] });
    },
  });
}
