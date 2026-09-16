import { GetTodoPayload, GetTodoResponse, GetTodoRoute } from '../../../.generated/operations';
import { inject, toToken } from 'ts-ioc-container';
import { Operation } from '../../../lib/components/Operation';
import { HTTPResponse, HTTPResponseKey } from '../../../lib/express/HTTPResponse';
import { GetTodo } from './GetTodo';
import { ID } from '../../../lib/em/Entity';

export class GetTodoHTTPRoute implements GetTodoRoute {
  constructor(
    @inject(toToken(Operation).args({ handler: GetTodo })) private getTodo: Operation<GetTodo>,
    @inject(HTTPResponseKey) private response: HTTPResponse,
  ) {}

  async handle({ params }: GetTodoPayload): Promise<GetTodoResponse> {
    const todo = await this.getTodo.handle({ todoID: params.id as ID });
    return this.response.ok({ body: todo });
  }
}
