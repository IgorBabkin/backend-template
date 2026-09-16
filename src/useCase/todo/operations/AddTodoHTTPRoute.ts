import { AddTodoPayload, AddTodoResponse, AddTodoRoute } from '../../../.generated/operations';
import { inject, toToken } from 'ts-ioc-container';
import { Operation } from '../../../lib/components/Operation';
import { IRequestContext, IRequestContextKey } from '../../../lib/components/RequestContext';
import { HTTPResponse, HTTPResponseKey } from '../../../lib/express/HTTPResponse';
import { AddTodo } from './AddTodo';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(
    @inject(toToken(Operation).args({ handler: AddTodo })) private addTodo: Operation<AddTodo>,
    @inject(IRequestContextKey) private context: IRequestContext,
    @inject(HTTPResponseKey) private response: HTTPResponse,
  ) {}

  async handle({ body }: AddTodoPayload): Promise<AddTodoResponse> {
    const todo = await this.addTodo.handle({
      title: body.title,
      description: body.description,
    });
    return this.response.redirect({ to: this.context.getUrl('getTodo', { params: { id: todo().id } }) });
  }
}
