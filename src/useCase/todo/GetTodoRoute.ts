import { GetTodoPayload, GetTodoResponse, GetTodoRoute, Ok } from '../../.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { ok } from '../../lib/express/utils';
import { GetTodo } from './GetTodo';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(private mediator: IMediator) {}

  async handle({ params }: GetTodoPayload): Promise<Ok<GetTodoResponse>> {
    const response = await this.mediator.send(GetTodo, { id: params.id });
    return ok(response);
  }
}
