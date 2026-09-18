import { describe, expect, it } from 'vitest';

import {
  computeTimesheetStats,
  getDayStatus,
} from '@/lib/timesheet';
import { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

const day = (partial: {
  date: string;
  hours?: number;
  off?: string;
  publicHoliday?: string;
}): Day =>
  ({
    '@id': `/days/${partial.date}`,
    date: partial.date,
    hours: partial.hours,
    off: partial.off,
    publicHoliday: partial.publicHoliday,
  }) as Day;

describe('getDayStatus', () => {
  it('prefers vacation over weekend', () => {
    expect(
      getDayStatus(
        day({
          date: '2025-01-04', // Saturday
          off: OffValues.vacation,
        }),
      ),
    ).toBe('vacation');
  });

  it('prefers sick over public holiday', () => {
    expect(
      getDayStatus(
        day({
          date: '2025-01-01',
          off: OffValues.sick,
          publicHoliday: 'Neujahr',
        }),
      ),
    ).toBe('sick');
  });

  it('marks public holidays', () => {
    expect(
      getDayStatus(
        day({
          date: '2025-01-01',
          publicHoliday: 'Neujahr',
        }),
      ),
    ).toBe('publicHoliday');
  });

  it('marks weekends when empty', () => {
    expect(getDayStatus(day({ date: '2025-01-05' }))).toBe('weekend'); // Sunday
  });

  it('marks worked hours on weekdays', () => {
    expect(
      getDayStatus(
        day({
          date: '2025-01-06', // Monday
          hours: 8,
        }),
      ),
    ).toBe('hours');
  });

  it('returns empty for unset weekdays', () => {
    expect(getDayStatus(day({ date: '2025-01-07' }))).toBe('empty');
  });
});

describe('computeTimesheetStats', () => {
  it('sums hours and counts vacation and sick days', () => {
    const stats = computeTimesheetStats([
      day({ date: '2025-01-06', hours: 8 }),
      day({ date: '2025-01-07', hours: 4 }),
      day({ date: '2025-01-08', off: OffValues.vacation }),
      day({ date: '2025-01-09', off: OffValues.vacation }),
      day({ date: '2025-01-10', off: OffValues.sick }),
      day({ date: '2025-01-11' }),
    ]);

    expect(stats).toEqual({
      totalHours: 12,
      workedDays: 2,
      vacationDays: 2,
      sickDays: 1,
    });
  });

  it('ignores zero hours for worked totals', () => {
    const stats = computeTimesheetStats([
      day({ date: '2025-01-06', hours: 0 }),
      day({ date: '2025-01-07', hours: 8 }),
    ]);

    expect(stats.totalHours).toBe(8);
    expect(stats.workedDays).toBe(1);
  });
});
