import { AddTodoPayload, AddTodoRoute } from '../../.generated/operations';
import { IAddTodo, IAddTodoKey } from './AddTodo';
import { Created } from '@ibabkin/openapi-to-server';
import { inject } from 'ts-ioc-container';
import { created } from '../../lib/express/utils';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(@inject(IAddTodoKey.resolve) private addTodo: IAddTodo) {}

  async handle({ body }: AddTodoPayload): Promise<Created> {
    const response = await this.addTodo.handle({
      title: body.title,
      description: body.description,
      userId: 'asdas',
    });
    return created;
  }
}
