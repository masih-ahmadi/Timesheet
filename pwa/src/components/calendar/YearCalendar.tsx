'use client';

import { FC } from 'react';

import {
  dayStatusClass,
  getDayDate,
  getDayStatus,
  getOffLabel,
  getPublicHolidayLabel,
  groupDaysByMonth,
  MONTHS,
} from '@/lib/timesheet';
import { cn } from '@/lib/utils';
import { Day } from '@/types/Day';

type Props = {
  days: Day[];
  selectedId?: string;
  onSelect: (day: Day) => void;
};

export const YearCalendar: FC<Props> = ({ days, selectedId, onSelect }) => {
  const months = groupDaysByMonth(days);

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-auto rounded-lg border border-slate-200 bg-white">
      <div className="w-max min-w-full p-3">
        <div className="sticky top-0 z-10 mb-2 grid w-[980px] grid-cols-32 gap-1 bg-white pb-1 text-center text-[10px] font-medium text-slate-400">
          <span />
          {Array.from({ length: 31 }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>

        <div className="w-[980px] space-y-1">
          {months.map((monthDays, monthIndex) => (
            <div key={MONTHS[monthIndex]} className="grid grid-cols-32 gap-1">
              <div className="flex items-center text-xs font-semibold text-slate-600">
                {MONTHS[monthIndex]}
              </div>
              {Array.from({ length: 31 }, (_, dayIndex) => {
                const day = monthDays.find(
                  (item) => getDayDate(item).getUTCDate() === dayIndex + 1,
                );

                if (!day) {
                  return <div key={dayIndex} className="h-8 rounded-sm bg-slate-50" />;
                }

                const status = getDayStatus(day);
                const holiday = getPublicHolidayLabel(day);
                const off = getOffLabel(day);
                const title = [
                  getDayDate(day).toISOString().slice(0, 10),
                  holiday ? `Holiday: ${holiday}` : null,
                  off ? `Off: ${off}` : null,
                  typeof day.hours === 'number' ? `Hours: ${day.hours}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <button
                    key={day['@id'] ?? `${monthIndex}-${dayIndex}`}
                    type="button"
                    title={title}
                    onClick={() => onSelect(day)}
                    className={cn(
                      'flex h-8 items-center justify-center rounded-sm border text-[10px] font-medium transition',
                      dayStatusClass[status],
                      selectedId === day['@id']
                        ? 'ring-2 ring-slate-900 ring-offset-1'
                        : 'border-slate-200',
                    )}
                  >
                    {typeof day.hours === 'number' ? day.hours : dayIndex + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
