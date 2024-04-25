import { GetTodoResponse } from '../../.generated/operations';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { IAppQuery, ITodoQuery } from './IAppQuery';

interface Query extends ITodoQuery {}

export interface IGetTodo extends IQueryHandler<Query, GetTodoResponse> {}

export class GetTodo implements IGetTodo {
  async handle({ todo }: IAppQuery<Query>): Promise<GetTodoResponse> {
    return todo.getState();
  }
}
