import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, ITodoQuery } from '../middleware/IAppQuery';
import { ITodo } from '../../domains/todo/ITodo';
import { MainHandler } from './MainHandler';
import { by, IContainer, inject } from 'ts-ioc-container';

interface Query extends ITodoQuery {}

export interface IGetTodo extends IQueryHandler<Query, ITodo> {}

export class GetTodo extends MainHandler<Query, ITodo> implements IGetTodo {
  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected async process({ todo }: IAppQuery<Query>): Promise<ITodo> {
    return todo.getState();
  }
}
