import { UnitOfWork } from './UnitOfWork';
import { by, inject, key } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/ITodoRepo';
import { Todo } from './Todo';
import { perRequest } from '../../lib/container/di';

export const ITodoUnitOfWorkKey = Symbol('ITodoUnitOfWork');

@perRequest
@key(ITodoUnitOfWorkKey)
export class TodoUnitOfWork extends UnitOfWork<Todo> {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo) {
    super();
  }

  protected async saveInstance(instance: Todo): Promise<void> {}
}
