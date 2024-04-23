import { ITodo } from '../../domains/todo/ITodo';
import { ITodoQuery, WithTodo } from './FindTodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { operation } from '../../lib/container/UseCaseProvider';
import { provider, register, scope } from 'ts-ioc-container';
import { accessor } from '../../lib/container/utils';
import { perScope } from '../../lib/mediator/Scope';

interface Query extends ITodoQuery {
  title?: string;
  description?: string;
}

export interface IUpdateTodo extends IQueryHandler<Query, () => ITodo> {}

export const IUpdateTodoKey = accessor<IUpdateTodo>(Symbol('IUpdateTodo'));

@provider(operation)
@register(IUpdateTodoKey.register, scope(perScope.Request))
export class UpdateTodo implements IUpdateTodo {
  async handle({ todo, title, description }: WithTodo<Query>): Promise<() => ITodo> {
    todo.update({ title, description });
    return () => todo.getState();
  }
}
