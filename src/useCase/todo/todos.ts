import { GetTodoHTTPRoute } from './GetTodoRoute';
import { IMediator } from 'ts-request-mediator';
import { AddTodoHTTPRoute } from './AddTodoRoute';

export const todos = (mediator: IMediator) => ({
  getTodo: new GetTodoHTTPRoute(mediator),
  addTodo: new AddTodoHTTPRoute(mediator),
});
