import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../../.generated/operations';
import { IUpdateTodo, UpdateTodo } from './UpdateTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { Response } from '../../../lib/express/Response';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(@inject(useOperation(UpdateTodo)) private updateTodo: IUpdateTodo) {}

  async handle({ headers, body, params }: UpdateTodoPayload): Promise<UpdateTodoResponse> {
    const response = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id,
      authToken: headers.Authorization,
    });
    return Response.OK({ body: response() });
  }
}
