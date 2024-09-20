import { DeleteTodoPayload, DeleteTodoResponse, DeleteTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { HTTPResponse } from '../../../lib/express/HTTPResponse';
import { DeleteTodo } from './DeleteTodo';
import { ID } from '../../../lib/em/IEntity';

export class DeleteTodoHTTPRoute implements DeleteTodoRoute {
  constructor(@inject(useOperation(DeleteTodo)) private deleteTodo: DeleteTodo) {}

  async handle({ params }: DeleteTodoPayload): Promise<DeleteTodoResponse> {
    await this.deleteTodo.handle({ todoID: params.id as ID });
    return HTTPResponse.NoContent();
  }
}
