import { GetTodoHTTPRoute } from './GetTodoRoute';
import { AddTodoHTTPRoute } from './AddTodoRoute';
import { IContainer } from 'ts-ioc-container';

export const todos = (container: IContainer) => ({
  getTodo: container.resolve(GetTodoHTTPRoute),
  addTodo: container.resolve(AddTodoHTTPRoute),
});
