import { IContainer } from 'ts-ioc-container';
import { IRequestContextKey } from '../components/RequestContext';

export interface IQueryHandler<TQuery = unknown, TResponse = unknown> {
  handle(query: TQuery): Promise<TResponse>;
}

export type MiddlewarePayload = {
  resource: unknown;
};
export type IMiddleware = IQueryHandler<MiddlewarePayload, void>;

export const isMiddleware =
  (...requiredTags: string[]) =>
  (as: Set<string>, c: IContainer) =>
    requiredTags.every((alias) => as.has(alias)) &&
    IRequestContextKey.resolve(c)
      .tags.concat(['common'])
      .some((tag) => as.has(tag));

export const middlewareMemo =
  (...requiredTags: string[]) =>
  (c: IContainer) =>
    `${requiredTags.join(',')}/${IRequestContextKey.resolve(c).tags.join(',')}`;
