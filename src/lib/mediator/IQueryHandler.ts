import { GroupAliasToken } from 'ts-ioc-container';

export interface IQueryHandler<TQuery = unknown, TResponse = unknown> {
  handle(query: TQuery): Promise<TResponse>;
}

export type MiddlewarePayload = {
  resource: unknown;
};
export type IMiddleware = IQueryHandler<MiddlewarePayload, void>;

export const IMiddlewareBeforeKey = new GroupAliasToken<IMiddleware>('IMiddlewareBefore');
export const IMiddlewareAfterKey = new GroupAliasToken<IMiddleware>('IMiddlewareAfter');
