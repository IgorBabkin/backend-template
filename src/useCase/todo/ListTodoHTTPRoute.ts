import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/mediator/OperationProvider';
import { Ok } from '@ibabkin/openapi-to-server';
import { Response } from '../../lib/express/utils';
import { ListTodoPayload, ListTodoResponse, ListTodoRoute } from '../../.generated/operations';
import { IListTodo, ListTodo } from './ListTodo';

export class ListTodoHTTPRoute implements ListTodoRoute {
  constructor(@inject(useOperation(ListTodo)) private listTodo: IListTodo) {}

  // eslint-disable-next-line no-empty-pattern
  async handle({}: ListTodoPayload): Promise<Ok<ListTodoResponse>> {
    const response = await this.listTodo.handle({});
    return Response.ok(response);
  }
}
