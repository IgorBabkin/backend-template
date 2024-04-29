import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, IAuthQuery, WithAuthUser } from '../IAppQuery';
import { AdminHandler } from '../AdminHandler';
import { by, IContainer, inject } from 'ts-ioc-container';
import { ITodoQuery } from './ITodoQuery';

interface Query extends ITodoQuery, IAuthQuery {}

export interface IDeleteTodo extends IQueryHandler<Query, void> {}

export class DeleteTodo extends AdminHandler<Query, void> implements IDeleteTodo {
  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }
  protected async process({ todo }: WithAuthUser<IAppQuery<Query>>): Promise<void> {
    todo.delete();
  }
}
