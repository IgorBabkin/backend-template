import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { GetTodo } from './GetTodo';
import { Ok } from '@ibabkin/openapi-to-server';
import { by, inject } from 'ts-ioc-container';
import { IRequestMediatorKey } from '../../lib/container/IRequestMediator';
import { ok } from '../../lib/express/utils';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(by(IRequestMediatorKey)) private mediator: IMediator) {}

  async handle({ params }: GetTodoPayload): Promise<Ok<GetTodoResponse>> {
    const response = await this.mediator.send(GetTodo, { id: params.id });
    return ok(response);
  }
}
