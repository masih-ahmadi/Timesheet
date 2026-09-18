'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchOffs, updateDay, UpdateDayPayload } from '@/api/timesheets';
import { queryKeys } from '@/hooks/queryKeys';

export const useOffs = () =>
  useQuery({
    queryKey: queryKeys.offs,
    queryFn: fetchOffs,
  });

export const useUpdateDay = (yearId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dayId,
      payload,
    }: {
      dayId: string;
      payload: UpdateDayPayload;
    }) => updateDay(dayId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.year(yearId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.years }),
      ]);
    },
  });
};
