'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createYear,
  deleteYear,
  fetchYear,
  fetchYears,
} from '@/api/timesheets';
import { queryKeys } from '@/hooks/queryKeys';

export const useYears = () =>
  useQuery({
    queryKey: queryKeys.years,
    queryFn: fetchYears,
  });

export const useYear = (id: string) =>
  useQuery({
    queryKey: queryKeys.year(id),
    queryFn: () => fetchYear(id),
    enabled: Boolean(id),
  });

export const useCreateYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createYear,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.years });
    },
  });
};

export const useDeleteYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteYear,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.years });
    },
  });
};
