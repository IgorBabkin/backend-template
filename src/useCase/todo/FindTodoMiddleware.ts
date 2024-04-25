import { entityManager, EntityManager } from '../../lib/em/EntityManager';
import { inject, register, scope } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { perScope } from '../../lib/mediator/Scope';
import { asMiddleware } from '../../lib/mediator/Middleware';
import { FillQueryMiddleware } from '../middleware/FillQueryMiddleware';
import { ITodoQuery, WithTodo } from '../middleware/IAppQuery';

@register(scope(perScope.Request))
@asMiddleware('middleware-before', 'common')
export class FindTodoMiddleware extends FillQueryMiddleware<ITodoQuery> {
  constructor(@inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodoRepo>) {
    super();
  }

  protected matchQuery(query: unknown): query is ITodoQuery {
    return 'todoID' in (query as any);
  }

  protected async execute(query: ITodoQuery): Promise<void> {
    (query as WithTodo<ITodoQuery>).todo = await this.em.findByIdOrFail(query.todoID);
  }
}
