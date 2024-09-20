import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { HTTPResponse } from '../../../lib/express/HTTPResponse';
import { UpdateTodo } from './UpdateTodo';
import { ID } from '../../../lib/em/IEntity';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(@inject(useOperation(UpdateTodo)) private updateTodo: UpdateTodo) {}

  async handle({ body, params }: UpdateTodoPayload): Promise<UpdateTodoResponse> {
    const todo = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id as ID,
    });
    return HTTPResponse.OK({ body: todo() });
  }
}
