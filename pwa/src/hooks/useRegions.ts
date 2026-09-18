'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchRegions } from '@/api/timesheets';
import { queryKeys } from '@/hooks/queryKeys';

export const useRegions = () =>
  useQuery({
    queryKey: queryKeys.regions,
    queryFn: fetchRegions,
  });
