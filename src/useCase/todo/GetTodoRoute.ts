import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../.generated/operations';
import { IGetTodo, IGetTodoKey } from './GetTodo';
import { Ok } from '@ibabkin/openapi-to-server';
import { inject } from 'ts-ioc-container';
import { ok } from '../../lib/express/utils';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(IGetTodoKey.resolve) private getTodo: IGetTodo) {}

  async handle({ params }: GetTodoPayload): Promise<Ok<GetTodoResponse>> {
    const response = await this.getTodo.handle({ id: params.id });
    return ok(response);
  }
}
