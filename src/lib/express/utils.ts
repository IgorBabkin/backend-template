import { HttpResponse } from '@ibabkin/openapi-to-server';
import { HttpHeaders } from '@ibabkin/openapi-to-server/cjm/utils/http';

export interface Created extends HttpResponse {
  status: 201;
  headers: {
    Location: string;
  };
}

const created = <THeaders extends Partial<HttpHeaders>>({ headers }: { headers?: THeaders }) => ({
  status: 201,
  headers,
});

export const Response = {
  created,
};
