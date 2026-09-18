'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

import {
  CalendarView,
  CalendarViewTabs,
  MonthCalendar,
  YearCalendar,
} from '@/components/calendar';
import { DayEditor } from '@/components/timesheet/DayEditor';
import { TimesheetLegend } from '@/components/timesheet/TimesheetLegend';
import { TimesheetStats } from '@/components/timesheet/TimesheetStats';
import { getErrorMessage } from '@/api/client';
import {
  computeTimesheetStats,
  getDayDate,
  getRegionLabel,
} from '@/lib/timesheet';
import { useYear } from '@/hooks/useYears';
import { Day } from '@/types/Day';

type Props = {
  yearId: string;
};

export const TimesheetDetail: FC<Props> = ({ yearId }) => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [view, setView] = useState<CalendarView>('monthly');
  const [month, setMonth] = useState(() => new Date().getMonth());
  const { data, isLoading, error } = useYear(yearId);

  useEffect(() => {
    if (!selectedDay?.['@id'] || !data?.days) {
      return;
    }

    const selectedId = selectedDay['@id'];
    const fresh = data.days.find((day) => day['@id'] === selectedId);
    if (fresh) {
      setSelectedDay(fresh);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps -- refresh selection only when year data reloads

  useEffect(() => {
    if (!data?.year) {
      return;
    }

    const currentYear = new Date().getFullYear();
    if (data.year === currentYear) {
      setMonth(new Date().getMonth());
    } else {
      setMonth(0);
    }
  }, [data?.year]);

  const handleSelectDay = (day: Day) => {
    setSelectedDay(day);
    setMonth(getDayDate(day).getUTCMonth());
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading timesheet…</p>;
  }

  if (error || !data) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {getErrorMessage(error, 'Could not load timesheet.')}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
            ← All timesheets
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Timesheet {data.year}
          </h1>
          <p className="mt-1 text-slate-600">{getRegionLabel(data.region)}</p>
        </div>
        <TimesheetLegend />
      </div>

      <TimesheetStats stats={computeTimesheetStats(data.days ?? [])} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-3">
          <CalendarViewTabs value={view} onChange={setView} />
          {view === 'monthly' ? (
            <MonthCalendar
              days={data.days ?? []}
              year={data.year ?? new Date().getFullYear()}
              month={month}
              onMonthChange={setMonth}
              selectedId={selectedDay?.['@id']}
              onSelect={handleSelectDay}
            />
          ) : (
            <YearCalendar
              days={data.days ?? []}
              selectedId={selectedDay?.['@id']}
              onSelect={handleSelectDay}
            />
          )}
        </div>
        {selectedDay ? (
          <DayEditor
            day={selectedDay}
            yearId={yearId}
            onClose={() => setSelectedDay(null)}
          />
        ) : (
          <aside className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            Select a day to record hours, mark vacation/sick leave, or edit a
            date range at once.
          </aside>
        )}
      </div>
    </div>
  );
};
