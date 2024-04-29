import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../.generated/operations';
import { GetTodo, IGetTodo } from './GetTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/mediator/OperationProvider';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(useOperation(GetTodo)) private getTodo: IGetTodo) {}

  async handle({ params }: GetTodoPayload): Promise<GetTodoResponse> {
    const todo = await this.getTodo.handle({ todoID: params.id });
    return {
      status: 200,
      headers: {},
      body: todo,
    };
  }
}
