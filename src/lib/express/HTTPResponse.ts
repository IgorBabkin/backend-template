import { bindTo, register, scope, singleton, SingleToken } from 'ts-ioc-container';
import { perScope } from '../components/Scope';

type RedirectResponse = { status: 302; headers: { Location: string } };

type NoContentResponse = { status: 204; headers: Record<string, never> };
type OkResponse<TBody> = { status: 200; headers: Record<string, never>; body: TBody };

export interface HTTPResponse {
  redirect({ to }: { to: string }): RedirectResponse;
  noContent(): NoContentResponse;
  ok<TBody>({ body }: { body: TBody }): OkResponse<TBody>;
}

export const HTTPResponseKey = new SingleToken<HTTPResponse>('HTTPResponse');

@register(bindTo(HTTPResponseKey), scope(perScope.Request), singleton())
export class RouteResponse implements HTTPResponse {
  redirect({ to }: { to: string }): RedirectResponse {
    return {
      status: 302,
      headers: {
        Location: to,
      },
    };
  }

  noContent(): NoContentResponse {
    return {
      status: 204,
      headers: {},
    };
  }

  ok<TBody>({ body }: { body: TBody }): OkResponse<TBody> {
    return {
      status: 200,
      headers: {},
      body,
    };
  }
}
