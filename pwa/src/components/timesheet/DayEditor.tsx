'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { getErrorMessage } from '@/api/client';
import { getResourceId } from '@/api/iri';
import { UpdateDayPayload } from '@/api/timesheets';
import {
  formatDateInput,
  getDayDate,
  getOffLabel,
  getPublicHolidayLabel,
  isWeekend,
} from '@/lib/timesheet';
import { useOffs, useUpdateDay } from '@/hooks/useDays';
import { dayEditSchema, DayEditValues } from '@/schemas/timesheet';
import { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

type Props = {
  day: Day;
  yearId: string;
  onClose: () => void;
};

const resolveOffValue = (day: Day, offs?: { '@id': string; value: string }[]) =>
  offs?.find((item) => item.value === getOffLabel(day))?.['@id'] ??
  offs?.[0]?.['@id'] ??
  '';

const initialValues = (
  day: Day,
  offs?: { '@id': string; value: string }[],
): DayEditValues => {
  const date = getDayDate(day);

  return {
    mode:
      getOffLabel(day) === OffValues.vacation ||
      getOffLabel(day) === OffValues.sick
        ? 'off'
        : 'hours',
    hours: day.hours ?? 8,
    off: resolveOffValue(day, offs),
    finish: formatDateInput(date),
    bulk: false,
  };
};

export const DayEditor: FC<Props> = ({ day, yearId, onClose }) => {
  const date = getDayDate(day);
  const dayId = day['@id'] ?? '';
  const { data: offs } = useOffs();
  const mutation = useUpdateDay(yearId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DayEditValues>({
    resolver: zodResolver(dayEditSchema),
    defaultValues: initialValues(day, offs),
  });

  useEffect(() => {
    reset(initialValues(day, offs));
  }, [dayId, reset]); // eslint-disable-line react-hooks/exhaustive-deps -- reset only when switching days

  useEffect(() => {
    if (!offs?.length) {
      return;
    }
    setValue('off', resolveOffValue(day, offs));
  }, [offs, dayId, setValue]); // eslint-disable-line react-hooks/exhaustive-deps -- fill off options once loaded

  const mode = watch('mode');
  const bulk = watch('bulk');

  const onSubmit = handleSubmit((values) => {
    const payload: UpdateDayPayload = {};

    if (values.mode === 'hours') {
      payload.hours = Number(values.hours ?? 0);
      payload.off = null;
    } else if (values.mode === 'off') {
      payload.off = values.off;
      payload.hours = null;
    } else {
      payload.hours = null;
      payload.off = null;
    }

    if (values.bulk && values.finish) {
      payload.finish = values.finish;
    }

    mutation.mutate(
      {
        dayId: getResourceId(day['@id']),
        payload,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  });

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {formatDateInput(date)}
          </h2>
          <p className="text-sm text-slate-500">
            {isWeekend(date) ? 'Weekend' : 'Weekday'}
            {getPublicHolidayLabel(day)
              ? ` · ${getPublicHolidayLabel(day)}`
              : ''}
            {getOffLabel(day) ? ` · ${getOffLabel(day)}` : ''}
            {typeof day.hours === 'number' ? ` · ${day.hours}h` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Close
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            Record type
          </legend>
          {(
            [
              ['hours', 'Working hours'],
              ['off', 'Day off'],
              ['clear', 'Clear entry'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input type="radio" value={value} {...register('mode')} />
              {label}
            </label>
          ))}
        </fieldset>

        {mode === 'hours' && (
          <div>
            <label
              htmlFor="hours"
              className="block text-sm font-medium text-slate-700"
            >
              Hours
            </label>
            <input
              id="hours"
              type="number"
              min={0}
              max={24}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
              {...register('hours', { valueAsNumber: true })}
            />
            {errors.hours && (
              <p className="mt-1 text-sm text-red-600">{errors.hours.message}</p>
            )}
          </div>
        )}

        {mode === 'off' && (
          <div>
            <label
              htmlFor="off"
              className="block text-sm font-medium text-slate-700"
            >
              Off type
            </label>
            <select
              id="off"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
              {...register('off')}
            >
              {offs?.map((item) => (
                <option key={item['@id']} value={item['@id']}>
                  {item.value}
                </option>
              ))}
            </select>
            {errors.off && (
              <p className="mt-1 text-sm text-red-600">{errors.off.message}</p>
            )}
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register('bulk')} />
          Edit multiple days (from this date through end date)
        </label>

        {bulk && (
          <div>
            <label
              htmlFor="finish"
              className="block text-sm font-medium text-slate-700"
            >
              End date
            </label>
            <input
              id="finish"
              type="date"
              min={formatDateInput(date)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
              {...register('finish')}
            />
            {errors.finish && (
              <p className="mt-1 text-sm text-red-600">{errors.finish.message}</p>
            )}
          </div>
        )}

        {mutation.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {getErrorMessage(mutation.error, 'Could not save day.')}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex w-full justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving…' : bulk ? 'Apply to range' : 'Save day'}
        </button>
      </form>
    </aside>
  );
};
