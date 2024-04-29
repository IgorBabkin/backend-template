import { Operations } from '.generated/operations';
import { IContainer } from 'ts-ioc-container';
import { AddTodoHTTPRoute } from './useCase/todo/add/AddTodoHTTPRoute';
import { UpdateTodoHTTPRoute } from './useCase/todo/update/UpdateTodoHTTPRoute';
import { GetTodoHTTPRoute } from './useCase/todo/get/GetTodoHTTPRoute';
import { ListTodoHTTPRoute } from './useCase/todo/list/ListTodoHTTPRoute';
import { DeleteTodoHTTPRoute } from './useCase/todo/delete/DeleteTodoHTTPRoute';

export const operations: Operations = {
  getTodo: (scope: IContainer) => scope.resolve(GetTodoHTTPRoute),
  addTodo: (scope: IContainer) => scope.resolve(AddTodoHTTPRoute),
  updateTodo: (scope: IContainer) => scope.resolve(UpdateTodoHTTPRoute),
  listTodo: (scope: IContainer) => scope.resolve(ListTodoHTTPRoute),
  deleteTodo: (scope: IContainer) => scope.resolve(DeleteTodoHTTPRoute),
};
