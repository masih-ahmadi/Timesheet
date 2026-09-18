import { z } from 'zod';

export const createTimesheetSchema = z.object({
  year: z.coerce
    .number({ invalid_type_error: 'Year is required' })
    .int()
    .min(2020, 'Year must be 2020 or later')
    .max(2030, 'Year must be 2030 or earlier'),
  region: z.string().min(1, 'Region is required'),
});

export type CreateTimesheetValues = z.infer<typeof createTimesheetSchema>;

export const dayEditSchema = z
  .object({
    mode: z.enum(['hours', 'off', 'clear']),
    hours: z.coerce.number().int().min(0).max(24).optional(),
    off: z.string().optional(),
    finish: z.string().optional(),
    bulk: z.boolean().default(false),
  })
  .superRefine((values, ctx) => {
    if (
      values.mode === 'hours' &&
      (values.hours === undefined || Number.isNaN(values.hours))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hours are required',
        path: ['hours'],
      });
    }

    if (values.mode === 'off' && !values.off) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Day off type is required',
        path: ['off'],
      });
    }

    if (values.bulk && !values.finish) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required for bulk edit',
        path: ['finish'],
      });
    }
  });

export type DayEditValues = z.infer<typeof dayEditSchema>;
