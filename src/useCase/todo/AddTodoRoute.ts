import { AddTodoPayload, AddTodoResponse, AddTodoRoute } from '../../.generated/operations';
import { AddTodo, IAddTodo } from './AddTodo';
import { inject } from 'ts-ioc-container';
import { useOperation } from '../../lib/mediator/OperationProvider';
import { IRequestContext } from '../../lib/mediator/RequestContext';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(
    @inject(useOperation(AddTodo)) private addTodo: IAddTodo,
    @inject(IRequestContext.resolve) private context: IRequestContext,
  ) {}

  async handle({ body }: AddTodoPayload): Promise<AddTodoResponse> {
    const todo = await this.addTodo.handle({
      title: body.title,
      description: body.description,
    });
    return {
      status: 302,
      headers: {
        Location: this.context.getUrl('getTodo', { params: { id: todo().id } }),
      },
    };
  }
}
