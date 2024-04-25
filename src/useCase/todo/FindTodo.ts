import { entityManager, EntityManager } from '../../lib/em/EntityManager';
import { ITodo } from '../../domains/todo/ITodo';
import { Entity, ID } from '../../lib/em/IEntity';
import { inject, register, scope } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { perScope } from '../../lib/mediator/Scope';
import { asMiddleware } from '../../lib/container/Middleware';
import { FillQuery } from './FillQuery';
import * as console from 'node:console';

export interface ITodoQuery {
  todoID: ID;
}

interface UserQuery {
  userId: string;
}

interface User {
  id: string;
  firstname: string;
}

type WithTodo<T> = T extends ITodoQuery ? T & { todo: Entity<ITodo> } : T;
type WithUser<T> = T extends UserQuery ? T & { user: Entity<User> } : T;

export type AppQuery<T> = WithUser<WithTodo<T>>;

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
