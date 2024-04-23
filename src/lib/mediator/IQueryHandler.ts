export interface IQueryHandler<TQuery = unknown, TResponse = unknown> {
  handle(query: TQuery): Promise<TResponse>;
}

export type MiddlewarePayload = {
  resource: unknown;
  query: unknown;
  result: unknown;
};
export type IMiddleware = IQueryHandler<MiddlewarePayload, void>;
