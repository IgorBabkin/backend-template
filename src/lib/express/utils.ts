import { Ok, Created, NoContent } from '@ibabkin/openapi-to-server';

const ok = <T>(payload: T): Ok<T> => ({ status: 200, payload });
const created: Created = { status: 201, payload: undefined };
const noContent: NoContent = { status: 204, payload: undefined };

export const Response = {
  ok,
  created,
  noContent,
};
