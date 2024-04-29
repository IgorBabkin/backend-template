import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { ListTodoPayload, ListTodoResponse, ListTodoRoute } from '../../../.generated/operations';
import { IListTodo, ListTodo } from './ListTodo';
import { Response } from '../../../lib/express/Response';

export class ListTodoHTTPRoute implements ListTodoRoute {
  constructor(@inject(useOperation(ListTodo)) private listTodo: IListTodo) {}

  // eslint-disable-next-line no-empty-pattern
  async handle({}: ListTodoPayload): Promise<ListTodoResponse> {
    const response = await this.listTodo.handle({});
    return Response.OK({ body: response });
  }
}
