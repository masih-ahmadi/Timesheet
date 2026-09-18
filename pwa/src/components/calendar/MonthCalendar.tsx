'use client';

import { FC } from 'react';

import {
  dayStatusClass,
  formatDateInput,
  getDayDate,
  getDayStatus,
  getOffLabel,
  getPublicHolidayLabel,
  MONTHS,
} from '@/lib/timesheet';
import { cn } from '@/lib/utils';
import { Day } from '@/types/Day';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

type Props = {
  days: Day[];
  year: number;
  month: number;
  onMonthChange: (month: number) => void;
  selectedId?: string;
  onSelect: (day: Day) => void;
};

const dayTitle = (day: Day): string =>
  [
    formatDateInput(getDayDate(day)),
    getPublicHolidayLabel(day)
      ? `Holiday: ${getPublicHolidayLabel(day)}`
      : null,
    getOffLabel(day) ? `Off: ${getOffLabel(day)}` : null,
    typeof day.hours === 'number' ? `Hours: ${day.hours}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

export const MonthCalendar: FC<Props> = ({
  days,
  year,
  month,
  onMonthChange,
  selectedId,
  onSelect,
}) => {
  const monthDays = days.filter(
    (day) => getDayDate(day).getUTCMonth() === month,
  );
  const daysByDate = new Map(
    monthDays.map((day) => [getDayDate(day).getUTCDate(), day]),
  );

  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  // Convert Sunday=0 to Monday-first index (0 = Monday)
  const leadingEmpty = (firstWeekday + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [
    ...Array.from({ length: leadingEmpty }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={month <= 0}
          onClick={() => onMonthChange(month - 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← {MONTHS[Math.max(month - 1, 0)]}
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {MONTH_LABELS[month]} {year}
        </h2>
        <button
          type="button"
          disabled={month >= 11}
          onClick={() => onMonthChange(month + 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {MONTHS[Math.min(month + 1, 11)]} →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            {weekday}
          </div>
        ))}

        {cells.map((dayNumber, index) => {
          if (dayNumber === null) {
            return <div key={`empty-${index}`} className="min-h-[4.5rem]" />;
          }

          const day = daysByDate.get(dayNumber);
          if (!day) {
            return (
              <div
                key={dayNumber}
                className="min-h-[4.5rem] rounded-md border border-dashed border-slate-100 bg-slate-50"
              />
            );
          }

          const status = getDayStatus(day);
          const holiday = getPublicHolidayLabel(day);
          const off = getOffLabel(day);

          return (
            <button
              key={day['@id'] ?? dayNumber}
              type="button"
              title={dayTitle(day)}
              onClick={() => onSelect(day)}
              className={cn(
                'flex min-h-[4.5rem] flex-col items-start gap-1 rounded-md border p-2 text-left transition',
                dayStatusClass[status],
                selectedId === day['@id']
                  ? 'ring-2 ring-slate-900 ring-offset-1'
                  : 'border-slate-200',
              )}
            >
              <span className="text-sm font-semibold">{dayNumber}</span>
              {typeof day.hours === 'number' && (
                <span className="text-xs font-medium">{day.hours}h</span>
              )}
              {(holiday || off) && (
                <span className="line-clamp-2 text-[10px] leading-tight opacity-90">
                  {off ?? holiday}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
