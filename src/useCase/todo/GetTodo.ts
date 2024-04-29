import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, ITodoQuery } from '../middleware/IAppQuery';
import { ITodo } from '../../domains/todo/ITodo';

interface Query extends ITodoQuery {}

export interface IGetTodo extends IQueryHandler<Query, ITodo> {}

export class GetTodo implements IGetTodo {
  async handle({ todo }: IAppQuery<Query>): Promise<ITodo> {
    return todo.getState();
  }
}
