import { IContainer } from 'ts-ioc-container';
import { AddTodoHTTPRoute } from './useCase/todo/operations/AddTodoHTTPRoute';
import { DeleteTodoHTTPRoute } from './useCase/todo/operations/DeleteTodoHTTPRoute';
import { GetTodoHTTPRoute } from './useCase/todo/operations/GetTodoHTTPRoute';
import { ListTodoHTTPRoute } from './useCase/todo/operations/ListTodoHTTPRoute';
import { UpdateTodoHTTPRoute } from './useCase/todo/operations/UpdateTodoHTTPRoute';

export const operations = {
  getTodo: (scope: IContainer) => scope.resolve(GetTodoHTTPRoute),
  addTodo: (scope: IContainer) => scope.resolve(AddTodoHTTPRoute),
  updateTodo: (scope: IContainer) => scope.resolve(UpdateTodoHTTPRoute),
  listTodo: (scope: IContainer) => scope.resolve(ListTodoHTTPRoute),
  deleteTodo: (scope: IContainer) => scope.resolve(DeleteTodoHTTPRoute),
};
