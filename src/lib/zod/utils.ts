import { ZodType } from 'zod';

export const validate =
  <T extends ZodType>(validator: T) =>
  (value: unknown) =>
    validator.parse(value);
