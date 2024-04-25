import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../.generated/operations';
import { Ok } from '@ibabkin/openapi-to-server';
import { Response } from '../../lib/express/utils';
import { IUpdateTodo, UpdateTodo } from './UpdateTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/container/OperationProvider';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(@inject(useOperation(UpdateTodo)) private updateTodo: IUpdateTodo) {}

  async handle({ body, params }: UpdateTodoPayload): Promise<Ok<UpdateTodoResponse>> {
    const response = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id,
    });
    return Response.ok(response());
  }
}
