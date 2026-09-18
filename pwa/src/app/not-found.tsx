import { FC } from 'react';
import Link from 'next/link';

const NotFound: FC = () => {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-600">That timesheet or page does not exist.</p>
      <Link
        href="/"
        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Back to timesheets
      </Link>
    </div>
  );
};

export default NotFound;
