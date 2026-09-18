import { customFetch, getApiPath } from '@/api/client';
import { toRelativeIri } from '@/api/iri';
import { METHOD_DELETE, METHOD_PATCH, METHOD_POST } from '@/api/constants';
import { PagedCollection } from '@/types/collection';
import { Day } from '@/types/Day';
import { Off } from '@/types/Off';
import { Region } from '@/types/Region';
import { Year } from '@/types/Year';

const collectionMembers = <T,>(data: PagedCollection<T> | undefined): T[] => {
  if (!data) {
    return [];
  }

  const hydra = data as PagedCollection<T> & { 'hydra:member'?: T[] };

  return data.member ?? hydra['hydra:member'] ?? [];
};

export const fetchYears = async (): Promise<Year[]> => {
  const response = await customFetch<PagedCollection<Year>>(
    getApiPath({ path: 'years', pagination: false }),
  );

  return collectionMembers(response?.data);
};

export const fetchYear = async (id: string): Promise<Year> => {
  const response = await customFetch<Year>(`/years/${id}`);

  if (!response?.data) {
    throw new Error('Timesheet not found');
  }

  return response.data;
};

export const fetchRegions = async (): Promise<Region[]> => {
  const response = await customFetch<PagedCollection<Region>>(
    getApiPath({ path: 'regions', pagination: false }),
  );

  return collectionMembers(response?.data);
};

export const fetchOffs = async (): Promise<Off[]> => {
  const response = await customFetch<PagedCollection<Off>>(
    getApiPath({ path: 'offs', pagination: false }),
  );

  return collectionMembers(response?.data);
};

export const createYear = async (payload: {
  year: number;
  region: string;
}): Promise<Year> => {
  const response = await customFetch<Year>('/years', {
    method: METHOD_POST,
    body: JSON.stringify({
      year: payload.year,
      region: toRelativeIri(payload.region),
    }),
  });

  if (!response?.data) {
    throw new Error('Could not create timesheet');
  }

  return response.data;
};

export const deleteYear = async (id: string): Promise<void> => {
  await customFetch(`/years/${id}`, {
    method: METHOD_DELETE,
  });
};

export type UpdateDayPayload = {
  hours?: number | null;
  off?: string | null;
  finish?: string;
};

export const updateDay = async (
  id: string,
  payload: UpdateDayPayload,
): Promise<Day> => {
  const body: UpdateDayPayload = { ...payload };
  if (typeof body.off === 'string') {
    body.off = toRelativeIri(body.off);
  }

  const response = await customFetch<Day>(`/days/${id}`, {
    method: METHOD_PATCH,
    body: JSON.stringify(body),
  });

  if (!response?.data) {
    throw new Error('Could not update day');
  }

  return response.data;
};
