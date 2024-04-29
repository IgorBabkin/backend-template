import { IContainer } from 'ts-ioc-container';
import { IRequestContext } from '../components/RequestContext';
import { byAliasesMemoized } from '../container/Memo';

export interface IQueryHandler<TQuery = unknown, TResponse = unknown> {
  handle(query: TQuery): Promise<TResponse>;
}

export type MiddlewarePayload = {
  resource: unknown;
  query: unknown;
  result: unknown;
};
export type IMiddleware = IQueryHandler<MiddlewarePayload, void>;

export const useMiddleware = (requiredTags: string[], optional: string[]) => (s: IContainer) => {
  const requestTags = IRequestContext.resolve(s).tags;
  const optionalTags = requestTags.concat(optional);
  return byAliasesMemoized(
    (p) => requiredTags.every((t) => p.has(t)) && optionalTags.some((t) => p.has(t)),
    `${requiredTags.join(',')}/${optionalTags.join(',')}`,
  )(s);
};
