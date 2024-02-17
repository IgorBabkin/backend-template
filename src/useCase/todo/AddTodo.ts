import { IQueryHandler, request } from 'ts-request-mediator';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/ITodoRepo';
import { by, inject } from 'ts-ioc-container';
import { PersistReposWithUnitOfWork } from './PersistReposWithUnitOfWork';

type Query = { title: string; description: string };

@request('after', [PersistReposWithUnitOfWork])
export class AddTodo implements IQueryHandler<Query, void> {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo) {}

  async handle(query: Query): Promise<void> {
    await this.todoRepo.create({ title: query.title, description: query.description });
  }
}
