import { by, IContainer, inject } from 'ts-ioc-container';
import { AdminHandler } from '../../AdminHandler';
import { ITodo } from '../../../domains/todo/ITodo';
import { IQueryHandler } from '../../../lib/mediator/IQueryHandler';
import { IAppQuery, IAuthQuery, WithAuthUser } from '../../IAppQuery';
import { ITodoQuery } from '../ITodoQuery';

interface Query extends ITodoQuery, IAuthQuery {
  title?: string;
  description?: string;
}

export class UpdateTodo extends AdminHandler<Query, () => ITodo> implements IQueryHandler<Query, () => ITodo> {
  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected async process({ todo, title, description }: WithAuthUser<IAppQuery<Query>>): Promise<() => ITodo> {
    todo.patch(() => ({ title, description }));
    return () => todo.getState();
  }
}
