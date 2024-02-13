import { AddTodoPayload, AddTodoRoute } from '../../.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { AddTodo } from './AddTodo';
import { Created } from '@ibabkin/openapi-to-server';
import { IResponseFactory, IResponseFactoryKey } from '../../lib/express/IResponseFactory';
import { by, inject } from 'ts-ioc-container';
import { IRequestMediatorKey } from '../../lib/container/IRequestMediator';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(
    @inject(by(IRequestMediatorKey)) private mediator: IMediator,
    @inject(by(IResponseFactoryKey)) private responseFactory: IResponseFactory,
  ) {}

  async handle({ body }: AddTodoPayload): Promise<Created> {
    await this.mediator.send(AddTodo, { title: body.title, description: body.description });
    return this.responseFactory.created();
  }
}
