import { ITodo } from '../../domains/todo/ITodo';
import { AppQuery, ITodoQuery } from './FindTodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';

interface Query extends ITodoQuery {
  title?: string;
  description?: string;
}

export interface IUpdateTodo extends IQueryHandler<Query, () => ITodo> {}

export class UpdateTodo implements IUpdateTodo {
  async handle({ todo, title, description }: AppQuery<Query>): Promise<() => ITodo> {
    todo.map(() => ({ title, description }));
    return () => todo.getState();
  }
}
