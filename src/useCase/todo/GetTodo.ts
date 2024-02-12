import { IQueryHandler } from 'ts-request-mediator';
import { GetTodoResponse } from '../../.generated/operations';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/ITodoRepo';
import { by, inject } from 'ts-ioc-container';

type Query = { id: string };

export class GetTodo implements IQueryHandler<Query, GetTodoResponse> {
  constructor(@inject(by(ITodoRepoKey)) private todoRepo: ITodoRepo) {}

  async handle(query: Query): Promise<GetTodoResponse> {
    const todo = await this.todoRepo.findByIdOrFail(query.id);
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
    };
  }
}
