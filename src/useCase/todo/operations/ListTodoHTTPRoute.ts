import { ListTodoPayload, ListTodoResponse, ListTodoRoute } from '../../../.generated/operations';
import { inject, toToken } from 'ts-ioc-container';
import { Operation } from '../../../lib/components/Operation';
import { HTTPResponse, HTTPResponseKey } from '../../../lib/express/HTTPResponse';
import { ListTodo } from './ListTodo';

export class ListTodoHTTPRoute implements ListTodoRoute {
  constructor(
    @inject(toToken(Operation).args({ handler: ListTodo })) private listTodo: Operation<ListTodo>,
    @inject(HTTPResponseKey) private response: HTTPResponse,
  ) {}

  // eslint-disable-next-line no-empty-pattern
  async handle({}: ListTodoPayload): Promise<ListTodoResponse> {
    const list = await this.listTodo.handle({});
    return this.response.ok({ body: list });
  }
}
