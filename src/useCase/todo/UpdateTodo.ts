import { ITodo } from '../../domains/todo/ITodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, ITodoQuery } from '../middleware/IAppQuery';

interface Query extends ITodoQuery {
  title?: string;
  description?: string;
}

export interface IUpdateTodo extends IQueryHandler<Query, () => ITodo> {}

export class UpdateTodo implements IUpdateTodo {
  async handle({ todo, title, description }: IAppQuery<Query>): Promise<() => ITodo> {
    todo.map(() => ({ title, description }));
    return () => todo.getState();
  }
}
