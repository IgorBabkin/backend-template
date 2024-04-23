import { IQueryHandler } from './IQueryHandler';

export interface IMediator {
  send<TQuery, TResponse>(handler: IQueryHandler<TQuery, TResponse>, query: TQuery): Promise<TResponse>;
}
