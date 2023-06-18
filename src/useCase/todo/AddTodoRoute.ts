import { AddTodoPayload, AddTodoRoute, Created } from '../../.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { created } from '../../lib/express/utils';
import { AddTodo } from './AddTodo';

export class AddTodoHTTPRoute implements AddTodoRoute {
  constructor(private mediator: IMediator) {}

  async handle({ body }: AddTodoPayload): Promise<Created> {
    await this.mediator.send(AddTodo, { title: body.title, description: body.description });
    return created;
  }
}
