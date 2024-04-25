import { IMiddleware, MiddlewarePayload } from '../lib/mediator/IQueryHandler';

export abstract class FillQuery<TQuery> implements IMiddleware {
  async handle({ query }: MiddlewarePayload): Promise<void> {
    if (this.matchQuery(query)) {
      await this.execute(query);
    }
  }

  protected abstract matchQuery(query: unknown): query is TQuery;

  protected abstract execute(query: TQuery): Promise<void>;
}
