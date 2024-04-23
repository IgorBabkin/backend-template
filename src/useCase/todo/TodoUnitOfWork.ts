import { UnitOfWork } from './UnitOfWork';
import { by, inject, key, register, scope } from 'ts-ioc-container';
import { Todo } from './Todo';
import { asSingleton } from '../../lib/container/di';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { Scope } from 'ts-request-mediator';

export const ITodoUnitOfWorkKey = Symbol('ITodoUnitOfWork');

@asSingleton
@register(key(ITodoUnitOfWorkKey), scope((c) => c.hasTag(Scope.Request)))
export class TodoUnitOfWork extends UnitOfWork<Todo> {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo) {
    super();
  }

  protected async saveInstance(instance: Todo): Promise<void> {}
}
