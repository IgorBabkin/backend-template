import { entityManager, EntityManager } from '../../lib/em/EntityManager';
import { ITodo, ITodoValue } from '../../domains/todo/ITodo';
import { Entity, ID } from '../../lib/em/IEntity';
import { alias, inject, provider, register, scope } from 'ts-ioc-container';
import { ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { perScope } from '../../lib/mediator/Scope';
import { middleware } from '../../lib/container/Middleware';
import { FillQuery } from './FillQuery';

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
@provider(middleware, alias('middleware', 'before', 'common'))
export class FindTodo extends FillQuery<ITodoQuery> {
  constructor(@inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodo, ITodoValue>) {
    super();
  }

  protected async execute(query: ITodoQuery): Promise<void> {
    (query as WithTodo<ITodoQuery>).todo = await this.em.findByIdOrFail(query.todoID);
  }

  protected matchQuery(query: unknown): query is ITodoQuery {
    return 'todoID' in (query as any);
  }
}
