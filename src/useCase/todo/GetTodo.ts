import { GetTodoResponse } from '../../.generated/operations';
import { by, inject, provider, register, scope } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { accessor } from '../../lib/container/utils';
import { perScope } from '../../lib/mediator/Scope';
import { operation } from '../../lib/container/UseCaseProvider';

type Query = { id: string };

export interface IGetTodo extends IQueryHandler<Query, GetTodoResponse> {}

export const IGetTodoKey = accessor<IGetTodo>(Symbol('IGetTodo'));

@register(IGetTodoKey.register, scope(perScope.Request))
@provider(operation)
export class GetTodo implements IGetTodo {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo) {}

  async handle(query: Query): Promise<GetTodoResponse> {
    const todo = await this.todoRepo.findByIdOrFail(query.id);
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
    };
  }
}
