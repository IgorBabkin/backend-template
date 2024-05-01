import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { Response } from '../../../lib/express/Response';
import { UpdateTodo } from './UpdateTodo';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(@inject(useOperation(UpdateTodo)) private updateTodo: UpdateTodo) {}

  async handle({ body, params }: UpdateTodoPayload): Promise<UpdateTodoResponse> {
    const response = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id,
    });
    return Response.OK({ body: response() });
  }
}
