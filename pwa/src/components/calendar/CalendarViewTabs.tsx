'use client';

import { FC } from 'react';

import { cn } from '@/lib/utils';

export type CalendarView = 'monthly' | 'yearly';

type Props = {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
};

const tabs: { id: CalendarView; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

export const CalendarViewTabs: FC<Props> = ({ value, onChange }) => {
  return (
    <div
      role="tablist"
      aria-label="Calendar view"
      className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1"
    >
      {tabs.map((tab) => {
        const selected = value === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition',
              selected
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
