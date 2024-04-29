import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { Response } from '../../../lib/express/Response';
import { GetTodo } from './GetTodo';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(useOperation(GetTodo)) private getTodo: GetTodo) {}

  async handle({ params }: GetTodoPayload): Promise<GetTodoResponse> {
    const todo = await this.getTodo.handle({ todoID: params.id });
    return Response.OK({ body: todo });
  }
}
