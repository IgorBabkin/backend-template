import { AddTodoPayload, AddTodoResponse, AddTodoRoute } from '../../../.generated/operations';
import { AddTodo, IAddTodo } from './AddTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { IRequestContext } from '../../../lib/components/RequestContext';
import { Response } from '../../../lib/express/Response';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(
    @inject(useOperation(AddTodo)) private addTodo: IAddTodo,
    @inject(IRequestContext.resolve) private context: IRequestContext,
  ) {}

  async handle({ body, headers }: AddTodoPayload): Promise<AddTodoResponse> {
    const todo = await this.addTodo.handle({
      title: body.title,
      description: body.description,
      authToken: headers.Authorization,
    });
    return Response.Redirect({ to: this.context.getUrl('getTodo', { params: { id: todo().id } }) });
  }
}