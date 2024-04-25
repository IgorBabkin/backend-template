import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../.generated/operations';
import { GetTodo, IGetTodo } from './GetTodo';
import { Ok } from '@ibabkin/openapi-to-server';
import { inject } from 'ts-ioc-container';
import { Response } from '../../lib/express/utils';
import { useOperation } from '../../lib/mediator/OperationProvider';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(useOperation(GetTodo)) private getTodo: IGetTodo) {}

  async handle({ params }: GetTodoPayload): Promise<Ok<GetTodoResponse>> {
    const response = await this.getTodo.handle({ todoID: params.id });
    return Response.ok(response);
  }
}
