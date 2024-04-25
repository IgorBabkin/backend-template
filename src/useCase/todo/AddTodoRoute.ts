import { AddTodoPayload, AddTodoRoute } from '../../.generated/operations';
import { AddTodo, IAddTodo } from './AddTodo';
import { Created } from '@ibabkin/openapi-to-server';
import { inject } from 'ts-ioc-container';
import { Response } from '../../lib/express/utils';
import { useOperation } from '../../lib/mediator/OperationProvider';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(@inject(useOperation(AddTodo)) private addTodo: IAddTodo) {}

  async handle({ body }: AddTodoPayload): Promise<Created> {
    const response = await this.addTodo.handle({
      title: body.title,
      description: body.description,
    });
    return Response.created;
  }
}
