import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../.generated/operations';
import { GetTodo, IGetTodo } from './GetTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/components/Operation';
import { Response } from '../../lib/express/Response';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(useOperation(GetTodo)) private getTodo: IGetTodo) {}

  async handle({ params }: GetTodoPayload): Promise<GetTodoResponse> {
    const todo = await this.getTodo.handle({ todoID: params.id });
    return Response.OK({ body: todo });
  }
}
