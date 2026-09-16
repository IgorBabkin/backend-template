import { DeleteTodoPayload, DeleteTodoResponse, DeleteTodoRoute } from '../../../.generated/operations';
import { inject, toToken } from 'ts-ioc-container';
import { Operation } from '../../../lib/components/Operation';
import { DeleteTodo } from './DeleteTodo';
import { ID } from '../../../lib/em/Entity';
import { HTTPResponse, HTTPResponseKey } from '../../../lib/express/HTTPResponse';

export class DeleteTodoHTTPRoute implements DeleteTodoRoute {
  constructor(
    @inject(toToken(Operation).args({ handler: DeleteTodo })) private deleteTodo: Operation<DeleteTodo>,
    @inject(HTTPResponseKey) private response: HTTPResponse,
  ) {}

  async handle({ params }: DeleteTodoPayload): Promise<DeleteTodoResponse> {
    await this.deleteTodo.handle({ todoID: params.id as ID });
    return this.response.noContent();
  }
}
