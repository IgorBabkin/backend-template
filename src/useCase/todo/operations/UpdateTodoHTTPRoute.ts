import { UpdateTodoPayload, UpdateTodoResponse, UpdateTodoRoute } from '../../../.generated/operations';
import { inject, toToken } from 'ts-ioc-container';
import { Operation } from '../../../lib/components/Operation';
import { HTTPResponse, HTTPResponseKey } from '../../../lib/express/HTTPResponse';
import { UpdateTodo } from './UpdateTodo';
import { ID } from '../../../lib/em/Entity';

export class UpdateTodoHTTPRoute implements UpdateTodoRoute {
  constructor(
    @inject(toToken(Operation).args({ handler: UpdateTodo })) private updateTodo: Operation<UpdateTodo>,
    @inject(HTTPResponseKey) private response: HTTPResponse,
  ) {}

  async handle({ body, params }: UpdateTodoPayload): Promise<UpdateTodoResponse> {
    const todo = await this.updateTodo.handle({
      title: body.title,
      description: body.description,
      todoID: params.id as ID,
    });
    return this.response.ok({ body: todo() });
  }
}
