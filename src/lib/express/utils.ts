import { Ok } from '../../.generated/operations';

export const ok = <T>(payload: T): Ok<T> => ({ status: 200, payload });
