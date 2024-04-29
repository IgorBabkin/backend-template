import { by, IContainer, inject } from 'ts-ioc-container';
import { ITodoQuery } from '../ITodoQuery';
import { IAppQuery, IAuthQuery, WithAuthUser } from '../../IAppQuery';
import { AdminHandler } from '../../AdminHandler';
import { IQueryHandler } from '../../../lib/mediator/IQueryHandler';

interface Query extends ITodoQuery, IAuthQuery {}

export class DeleteTodo extends AdminHandler<Query, void> implements IQueryHandler<Query, void> {
  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected async process({ todo }: WithAuthUser<IAppQuery<Query>>): Promise<void> {
    todo.delete();
  }
}
