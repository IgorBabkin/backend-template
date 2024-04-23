import { entityManager, EntityManager, IEntityKey } from '../../lib/em/EntityManager';
import { ITodo, ITodoValue } from '../../domains/todo/ITodo';
import { Entity, ID } from '../../lib/em/IEntity';
import { alias, inject, provider, register, scope } from 'ts-ioc-container';
import { ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { IMiddleware } from '../../lib/mediator/IQueryHandler';
import { undefined } from 'zod';
import { Scope } from '../../lib/mediator/Scope';
import { middleware } from '../../lib/container/Middleware';

export interface ITodoQuery {
  todoID: ID;
}

export type WithTodo<Payload extends ITodoQuery> = Payload & {
  todo: Entity<ITodo>;
};

const isTodoQuery = (payload: unknown): payload is ITodoQuery => {
  return (payload as any).todoID !== undefined;
};

@register(scope((s) => s.hasTag(Scope.Request)))
@provider(middleware, alias('middleware', 'before', 'common'))
export class FindTodo implements IMiddleware {
  constructor(@inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodo, ITodoValue>) {}

  async handle(payload: unknown): Promise<void> {
    if (isTodoQuery(payload)) {
      (payload as WithTodo<ITodoQuery>).todo = await this.em.findByIdOrFail(payload.todoID);
    }
  }
}
