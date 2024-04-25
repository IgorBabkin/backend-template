import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/container/OperationProvider';
import { DeleteTodoPayload, DeleteTodoRoute } from '.generated/operations';
import { DeleteTodo, IDeleteTodo } from './DeleteTodo';
import { NoContent } from '@ibabkin/openapi-to-server';
import { Response } from '../../lib/express/utils';

export class DeleteTodoHTTPRoute implements DeleteTodoRoute {
  constructor(@inject(useOperation(DeleteTodo)) private deleteTodo: IDeleteTodo) {}

  async handle({ params }: DeleteTodoPayload): Promise<NoContent> {
    await this.deleteTodo.handle({ todoID: params.id });
    return Response.noContent;
  }
}
