import { IQueryHandler } from '../IQueryHandler';
import { IMediator } from './IMediator';
import { Scope } from '../app/Scope';
import { IDependencyContainer } from '../di/IDependencyContainer';

export abstract class ScopedMediator implements IMediator {
  protected abstract scopes: Scope[];

  constructor(private scope: IDependencyContainer) {}

  async send<TQuery, TResponse>(queryHandler: IQueryHandler<TQuery, TResponse>, query: TQuery): Promise<TResponse> {
    const scope = this.scope.createScope(this.scopes);
    try {
      const mediator = this.createMediator(scope);
      return await mediator.send(queryHandler, query);
    } finally {
      scope.dispose();
    }
  }

  protected abstract createMediator(scope: IDependencyContainer): IMediator;
}
