import { z, ZodType } from 'zod';

export const zNumber = z.string().regex(/^\d+$/).transform(Number);

export const validate =
  <T extends ZodType>(validator: T) =>
  (value: unknown) =>
    validator.parse(value);
