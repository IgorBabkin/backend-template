export interface IQueryHandler<TQuery = unknown, TResponse = unknown> {
  handle(query: TQuery): Promise<TResponse>;
}

export interface IMiddleware<TQuery = unknown, TResource = unknown, TResult = unknown> {
  handle(query: TQuery, resource: TResource, result: TResult): Promise<void>;
}
