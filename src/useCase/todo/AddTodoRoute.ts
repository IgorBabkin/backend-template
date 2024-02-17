import { AddTodoPayload, AddTodoRoute } from '../../.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { AddTodo } from './AddTodo';
import { Created } from '@ibabkin/openapi-to-server';
import { by, inject } from 'ts-ioc-container';
import { IRequestMediatorKey } from '../../lib/container/IRequestMediator';
import { created } from '../../lib/express/utils';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(@inject(by.key(IRequestMediatorKey)) private mediator: IMediator) {}

  async handle({ body }: AddTodoPayload): Promise<Created> {
    await this.mediator.send(AddTodo, { title: body.title, description: body.description });
    return created;
  }
}
