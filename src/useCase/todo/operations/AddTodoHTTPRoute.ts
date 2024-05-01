import { AddTodoPayload, AddTodoResponse, AddTodoRoute } from '../../../.generated/operations';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../../lib/components/Operation';
import { IRequestContext, IRequestContextKey } from '../../../lib/components/RequestContext';
import { Response } from '../../../lib/express/Response';
import { AddTodo } from './AddTodo';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(
    @inject(useOperation(AddTodo)) private addTodo: AddTodo,
    @inject(IRequestContextKey.resolve) private context: IRequestContext,
  ) {}

  async handle({ body }: AddTodoPayload): Promise<AddTodoResponse> {
    const todo = await this.addTodo.handle({
      title: body.title,
      description: body.description,
    });
    return Response.Redirect({ to: this.context.getUrl('getTodo', { params: { id: todo().id } }) });
  }
}
