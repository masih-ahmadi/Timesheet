import { FC } from 'react';

import { legend } from '@/types/Year';

const colorClass: Record<string, string> = {
  blue: 'bg-blue-200',
  green: 'bg-green-200',
  red: 'bg-red-200',
  yellow: 'bg-yellow-200',
};

export const TimesheetLegend: FC = () => {
  return (
    <ul className="flex flex-wrap gap-3 text-sm text-slate-600">
      {Object.entries(legend).map(([key, item]) => (
        <li key={key} className="inline-flex items-center gap-2">
          <span
            className={`inline-block h-3.5 w-3.5 rounded-sm border border-slate-300 ${colorClass[item.color] ?? 'bg-slate-200'}`}
          />
          {item.name}
        </li>
      ))}
      <li className="inline-flex items-center gap-2">
        <span className="inline-block h-3.5 w-3.5 rounded-sm bg-slate-800" />
        hours
      </li>
    </ul>
  );
};
