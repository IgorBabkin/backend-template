import { AddTodoPayload, AddTodoRoute } from '../../.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { AddTodo } from './AddTodo';
import { Created } from '@ibabkin/openapi-to-server';
import { IResponseFactory } from '../../lib/express/IResponseFactory';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(private mediator: IMediator, private responseFactory: IResponseFactory) {}

  async handle({ body }: AddTodoPayload): Promise<Created> {
    await this.mediator.send(AddTodo, { title: body.title, description: body.description });
    return this.responseFactory.created();
  }
}
