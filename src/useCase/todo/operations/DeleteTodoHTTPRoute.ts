import { DeleteTodoPayload, DeleteTodoResponse, DeleteTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { Response } from '../../../lib/express/Response';
import { DeleteTodo } from './DeleteTodo';

export class DeleteTodoHTTPRoute implements DeleteTodoRoute {
  constructor(@inject(useOperation(DeleteTodo)) private deleteTodo: DeleteTodo) {}

  async handle({ params }: DeleteTodoPayload): Promise<DeleteTodoResponse> {
    await this.deleteTodo.handle({ todoID: params.id });
    return Response.NoContent();
  }
}
