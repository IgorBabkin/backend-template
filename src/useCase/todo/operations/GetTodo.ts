import { by, IContainer, inject } from 'ts-ioc-container';
import { MainHandler } from '../../MainHandler';
import { ITodo } from '../../../domains/todo/ITodo';
import { IQueryHandler } from '../../../lib/mediator/IQueryHandler';
import { IAppQuery } from '../../IAppQuery';
import { ITodoQuery } from '../ITodoQuery';

interface Query extends ITodoQuery {}

export class GetTodo extends MainHandler<Query, ITodo> implements IQueryHandler<Query, ITodo> {
  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected async process({ todo }: IAppQuery<Query>): Promise<ITodo> {
    return todo.getState();
  }
}
