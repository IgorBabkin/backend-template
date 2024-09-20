import { ListTodoPayload, ListTodoResponse, ListTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { HTTPResponse } from '../../../lib/express/HTTPResponse';
import { ListTodo } from './ListTodo';

export class ListTodoHTTPRoute implements ListTodoRoute {
  constructor(@inject(useOperation(ListTodo)) private listTodo: ListTodo) {}

  // eslint-disable-next-line no-empty-pattern
  async handle({}: ListTodoPayload): Promise<ListTodoResponse> {
    const list = await this.listTodo.handle({});
    return HTTPResponse.OK({ body: list });
  }
}
