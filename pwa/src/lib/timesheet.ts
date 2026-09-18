import { OffValues } from '@/types/Off';
import { Day } from '@/types/Day';
import { utc } from '@/lib/utils';

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export type DayStatus =
  | 'weekend'
  | 'publicHoliday'
  | 'vacation'
  | 'sick'
  | 'hours'
  | 'empty';

export const getDayDate = (day: Day): Date => {
  const raw = day.date as unknown as string | Date;
  return utc(typeof raw === 'string' ? new Date(raw) : raw);
};

export const formatDateInput = (date: Date): string =>
  date.toISOString().slice(0, 10);

export const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

export const getPublicHolidayLabel = (day: Day): string | null => {
  const value = day.publicHoliday as unknown;
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return String((value as { value: string }).value);
  }
  return null;
};

export const getOffLabel = (day: Day): string | null => {
  const value = day.off as unknown;
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return String((value as { value: string }).value);
  }
  return null;
};

export const getRegionLabel = (region: unknown): string => {
  if (!region) {
    return 'Unknown region';
  }
  if (typeof region === 'string') {
    return region;
  }
  if (typeof region === 'object' && region !== null && 'value' in region) {
    return String((region as { value: string }).value);
  }
  return 'Unknown region';
};

export const getDayStatus = (day: Day): DayStatus => {
  const off = getOffLabel(day);
  if (off === OffValues.vacation) {
    return 'vacation';
  }
  if (off === OffValues.sick) {
    return 'sick';
  }
  if (getPublicHolidayLabel(day)) {
    return 'publicHoliday';
  }
  if (isWeekend(getDayDate(day))) {
    return 'weekend';
  }
  if (typeof day.hours === 'number') {
    return 'hours';
  }
  return 'empty';
};

export const dayStatusClass: Record<DayStatus, string> = {
  weekend: 'bg-blue-200 text-blue-950',
  publicHoliday: 'bg-green-200 text-green-950',
  vacation: 'bg-red-200 text-red-950',
  sick: 'bg-yellow-200 text-yellow-950',
  hours: 'bg-slate-800 text-white',
  empty: 'bg-white text-slate-700 hover:bg-slate-50',
};

export const groupDaysByMonth = (days: Day[] = []): Day[][] => {
  const months: Day[][] = Array.from({ length: 12 }, () => []);

  days.forEach((day) => {
    const date = getDayDate(day);
    months[date.getUTCMonth()].push(day);
  });

  return months;
};


export type TimesheetStatsSummary = {
  totalHours: number;
  workedDays: number;
  vacationDays: number;
  sickDays: number;
};

export const computeTimesheetStats = (
  days: Day[] = [],
): TimesheetStatsSummary => {
  return days.reduce<TimesheetStatsSummary>(
    (stats, day) => {
      if (typeof day.hours === 'number' && day.hours > 0) {
        stats.totalHours += day.hours;
        stats.workedDays += 1;
      }

      const off = getOffLabel(day);
      if (off === OffValues.vacation) {
        stats.vacationDays += 1;
      }
      if (off === OffValues.sick) {
        stats.sickDays += 1;
      }

      return stats;
    },
    {
      totalHours: 0,
      workedDays: 0,
      vacationDays: 0,
      sickDays: 0,
    },
  );
};
