import { entityManager, EntityManager } from '../../lib/em/EntityManager';
import { inject, register, scope } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { perScope } from '../../lib/mediator/Scope';
import { asMiddleware } from '../../lib/container/Middleware';
import { FillQuery } from '../FillQuery';
import * as console from 'node:console';
import { ITodoQuery, WithTodo } from './IAppQuery';

@register(scope(perScope.Request))
@asMiddleware('middleware-before', 'common')
export class FindTodo extends FillQuery<ITodoQuery> {
  constructor(@inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodoRepo>) {
    super();
  }

  protected async execute(query: ITodoQuery): Promise<void> {
    (query as WithTodo<ITodoQuery>).todo = await this.em.findByIdOrFail(query.todoID);
  }

  protected matchQuery(query: unknown): query is ITodoQuery {
    console.log('FindTodo middleware');
    return 'todoID' in (query as any);
  }
}
