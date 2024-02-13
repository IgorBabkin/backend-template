import { Ok, Created } from '@ibabkin/openapi-to-server';

export const ok = <T>(payload: T): Ok<T> => ({ status: 200, payload });
export const created: Created = { status: 201, payload: undefined };
