'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { getErrorMessage } from '@/api/client';
import { getResourceId } from '@/api/iri';
import { useRegions } from '@/hooks/useRegions';
import { useCreateYear } from '@/hooks/useYears';
import {
  createTimesheetSchema,
  CreateTimesheetValues,
} from '@/schemas/timesheet';

export const CreateTimesheetForm: FC = () => {
  const router = useRouter();
  const {
    data: regions,
    isLoading: regionsLoading,
    error: regionsError,
  } = useRegions();
  const mutation = useCreateYear();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTimesheetValues>({
    resolver: zodResolver(createTimesheetSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      region: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      {
        year: values.year,
        region: values.region,
      },
      {
        onSuccess: (year) => {
          router.push(`/years/${getResourceId(year['@id'])}`);
        },
      },
    );
  });

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-lg space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-slate-700">
          Year
        </label>
        <input
          id="year"
          type="number"
          min={2020}
          max={2030}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          {...register('year')}
        />
        {errors.year && (
          <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="region"
          className="block text-sm font-medium text-slate-700"
        >
          Region
        </label>
        <select
          id="region"
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          disabled={regionsLoading}
          {...register('region')}
        >
          <option value="">Select a German region…</option>
          {regions?.map((region) => (
            <option key={region['@id']} value={region['@id']}>
              {region.value}
            </option>
          ))}
        </select>
        {errors.region && (
          <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
        )}
        {regionsError && (
          <p className="mt-1 text-sm text-red-600">
            {getErrorMessage(regionsError, 'Could not load regions.')}
          </p>
        )}
      </div>

      {mutation.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {getErrorMessage(mutation.error, 'Could not create timesheet.')}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex w-full justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {mutation.isPending ? 'Creating…' : 'Create timesheet'}
      </button>
    </form>
  );
};
