import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../.generated/operations';
import { IUpdateTodo, UpdateTodo } from './UpdateTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/mediator/OperationProvider';
import { Response } from '../../lib/express/Response';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(@inject(useOperation(UpdateTodo)) private updateTodo: IUpdateTodo) {}

  async handle({ body, params }: UpdateTodoPayload): Promise<UpdateTodoResponse> {
    const response = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id,
    });
    return Response.OK({ body: response() });
  }
}
