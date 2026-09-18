import Link from 'next/link';
import { FC } from 'react';

import { CreateTimesheetForm } from '@/components/timesheet';

const Page: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          ← All timesheets
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Create timesheet
        </h1>
        <p className="mt-2 text-slate-600">
          Choose a year and region. Public holidays for that Bundesland are
          filled in automatically.
        </p>
      </div>
      <CreateTimesheetForm />
    </div>
  );
};

export default Page;
