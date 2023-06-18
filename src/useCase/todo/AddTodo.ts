import { IQueryHandler } from 'ts-request-mediator';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/ITodoRepo';
import { inject } from 'ts-constructor-injector';
import { by } from 'ts-ioc-container';

type Query = { title: string; description: string };

export class AddTodo implements IQueryHandler<Query, void> {
  constructor(@inject(by(ITodoRepoKey)) private todoRepo: ITodoRepo) {}

  async handle(query: Query): Promise<void> {
    await this.todoRepo.create({ title: query.title, description: query.description });
  }
}
