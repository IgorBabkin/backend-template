import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../.generated/operations';
import { Ok } from '@ibabkin/openapi-to-server';
import { ok } from '../../lib/express/utils';
import { IUpdateTodo, IUpdateTodoKey } from './UpdateTodo';
import { inject } from 'ts-ioc-container';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(@inject(IUpdateTodoKey.resolve) private updateTodo: IUpdateTodo) {}

  async handle({ body, params }: UpdateTodoPayload): Promise<Ok<UpdateTodoResponse>> {
    const response = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id,
    });
    return ok(response());
  }
}
