import { GetTodoResponse } from '../../.generated/operations';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { AppQuery, ITodoQuery } from './FindTodo';

interface Query extends ITodoQuery {}

export interface IGetTodo extends IQueryHandler<Query, GetTodoResponse> {}

export class GetTodo implements IGetTodo {
  async handle({ todo }: AppQuery<Query>): Promise<GetTodoResponse> {
    return {
      id: todo.id,
      title: todo.getState().title,
      description: todo.getState().description,
    };
  }
}
