import { ITodo } from '../../domains/todo/ITodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, IAuthQuery, ITodoQuery, WithAuthUser } from '../middleware/IAppQuery';
import { AdminHandler } from './AdminHandler';
import { by, IContainer, inject } from 'ts-ioc-container';

interface Query extends ITodoQuery, IAuthQuery {
  title?: string;
  description?: string;
}

export interface IUpdateTodo extends IQueryHandler<Query, () => ITodo> {}

export class UpdateTodo extends AdminHandler<Query, () => ITodo> implements IUpdateTodo {
  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected async process({ todo, title, description }: WithAuthUser<IAppQuery<Query>>): Promise<() => ITodo> {
    todo.map(() => ({ title, description }));
    return () => todo.getState();
  }
}
