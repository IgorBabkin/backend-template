import { ListTodoPayload, ListTodoResponse, ListTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { Response } from '../../../lib/express/Response';
import { ListTodo } from './ListTodo';

export class ListTodoHTTPRoute implements ListTodoRoute {
  constructor(@inject(useOperation(ListTodo)) private listTodo: ListTodo) {}

  // eslint-disable-next-line no-empty-pattern
  async handle({}: ListTodoPayload): Promise<ListTodoResponse> {
    const response = await this.listTodo.handle({});
    return Response.OK({ body: response });
  }
}
