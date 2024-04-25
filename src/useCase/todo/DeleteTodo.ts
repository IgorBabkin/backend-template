import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, ITodoQuery } from '../middleware/IAppQuery';

interface Query extends ITodoQuery {}

export interface IDeleteTodo extends IQueryHandler<Query, void> {}

export class DeleteTodo implements IDeleteTodo {
  async handle({ todo }: IAppQuery<Query>): Promise<void> {
    todo.delete();
  }
}
