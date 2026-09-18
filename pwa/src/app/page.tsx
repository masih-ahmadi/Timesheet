import Link from 'next/link';
import { FC } from 'react';

import { TimesheetList } from '@/components/timesheet';

const Page: FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            FUNDED
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Timesheets
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Create yearly timesheets, track working hours and days off, and see
            weekends plus German public holidays by region.
          </p>
        </div>
        <Link
          href="/years/new"
          className="inline-flex rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          New timesheet
        </Link>
      </div>

      <TimesheetList />
    </div>
  );
};

export default Page;
