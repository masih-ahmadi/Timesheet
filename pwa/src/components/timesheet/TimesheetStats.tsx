import { FC } from 'react';

import { TimesheetStatsSummary } from '@/lib/timesheet';

type Props = {
  stats: TimesheetStatsSummary;
};

const items: {
  key: keyof TimesheetStatsSummary;
  label: string;
  suffix?: string;
  accent: string;
}[] = [
  {
    key: 'totalHours',
    label: 'Working hours',
    suffix: 'h',
    accent: 'border-slate-800',
  },
  {
    key: 'workedDays',
    label: 'Worked days',
    accent: 'border-slate-400',
  },
  {
    key: 'vacationDays',
    label: 'Vacation days',
    accent: 'border-red-400',
  },
  {
    key: 'sickDays',
    label: 'Sick days',
    accent: 'border-yellow-400',
  },
];

export const TimesheetStats: FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.key}
          className={`rounded-lg border border-slate-200 border-l-4 bg-white px-4 py-3 ${item.accent}`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
            {stats[item.key]}
            {item.suffix ? (
              <span className="ml-1 text-sm font-medium text-slate-500">
                {item.suffix}
              </span>
            ) : null}
          </p>
        </div>
      ))}
    </div>
  );
};
