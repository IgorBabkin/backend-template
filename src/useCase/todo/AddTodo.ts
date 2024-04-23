import { EntityManager } from '../../lib/em/EntityManager';
import { ITodo, ITodoValue } from '../../domains/todo/ITodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { provider, register, scope } from 'ts-ioc-container';
import { operation } from '../../lib/container/UseCaseProvider';
import { perScope } from '../../lib/mediator/Scope';
import { accessor } from '../../lib/container/utils';

interface IUserQuery {
  userId: string;
}

interface Query extends IUserQuery {
  title: string;
  description: string;
}

export interface IAddTodo extends IQueryHandler<Query, () => ITodo> {}

export const IAddTodoKey = accessor<IAddTodo>(Symbol('IAddTodo'));

@provider(operation)
@register(IAddTodoKey.register, scope(perScope.Request))
export class AddTodo implements IAddTodo {
  constructor(private em: EntityManager<ITodo, ITodoValue>) {}

  async handle(query: Query): Promise<() => ITodo> {
    const todo = this.em.create({ title: query.title, description: query.description });
    return () => todo.getResult();
  }
}
