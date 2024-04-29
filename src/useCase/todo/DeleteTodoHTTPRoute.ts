import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/mediator/OperationProvider';
import { DeleteTodoPayload, DeleteTodoResponse, DeleteTodoRoute } from '.generated/operations';
import { DeleteTodo, IDeleteTodo } from './DeleteTodo';
import { Response } from '../../lib/express/Response';

export class DeleteTodoHTTPRoute implements DeleteTodoRoute {
  constructor(@inject(useOperation(DeleteTodo)) private deleteTodo: IDeleteTodo) {}

  async handle({ params, headers }: DeleteTodoPayload): Promise<DeleteTodoResponse> {
    await this.deleteTodo.handle({ todoID: params.id, authToken: headers.Authorization });
    return Response.NoContent();
  }
}
