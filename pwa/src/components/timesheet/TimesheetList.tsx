'use client';

import Link from 'next/link';
import { FC } from 'react';

import { getResourceId } from '@/api/iri';
import { getErrorMessage } from '@/api/client';
import { useDeleteYear, useYears } from '@/hooks/useYears';
import { getRegionLabel } from '@/lib/timesheet';

export const TimesheetList: FC = () => {
  const { data, isLoading, error } = useYears();
  const removeMutation = useDeleteYear();

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading timesheets…</p>;
  }

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {getErrorMessage(error, 'Could not load timesheets.')}
      </p>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
        <p className="text-sm text-slate-600">No timesheets yet.</p>
        <Link
          href="/years/new"
          className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Create your first timesheet
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
      {data.map((year) => {
        const id = getResourceId(year['@id']);

        return (
          <li
            key={year['@id'] ?? id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <Link
                href={`/years/${id}`}
                className="text-base font-semibold text-slate-900 hover:underline"
              >
                {year.year}
              </Link>
              <p className="text-sm text-slate-500">
                {getRegionLabel(year.region)} · {year.days?.length ?? 0} days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/years/${id}`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Open
              </Link>
              <button
                type="button"
                disabled={removeMutation.isPending}
                onClick={() => {
                  if (confirm(`Delete timesheet ${year.year}?`)) {
                    removeMutation.mutate(id);
                  }
                }}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
