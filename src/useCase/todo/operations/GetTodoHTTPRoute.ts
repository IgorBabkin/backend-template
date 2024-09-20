import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { HTTPResponse } from '../../../lib/express/HTTPResponse';
import { GetTodo } from './GetTodo';
import { ID } from '../../../lib/em/IEntity';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(@inject(useOperation(GetTodo)) private getTodo: GetTodo) {}

  async handle({ params }: GetTodoPayload): Promise<GetTodoResponse> {
    const todo = await this.getTodo.handle({ todoID: params.id as ID });
    return HTTPResponse.OK({ body: todo });
  }
}
