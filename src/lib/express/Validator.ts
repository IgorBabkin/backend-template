import { ZodType } from 'zod';

export class Validator {
  constructor(private validators: Record<string, ZodType>) {}
  parse(operationId: string, data: unknown) {
    const validator = this.validators[operationId];
    if (!validator) {
      throw new Error(`Validator ${operationId} not found`);
    }
    return validator.parse(data);
  }
}
