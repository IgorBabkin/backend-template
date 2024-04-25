import { Operations } from './.generated/operations';
import { IContainer } from 'ts-ioc-container';
import { AddTodoHTTPRoute } from './useCase/todo/AddTodoRoute';
import { UpdateTodoHTTPRoute } from './useCase/todo/UpdateTodoRoute';
import { GetTodoHTTPRoute } from './useCase/todo/GetTodoRoute';
import { ListTodoHTTPRoute } from './useCase/todo/ListTodoHTTPRoute';

export const operations: Operations = {
  getTodo: (scope: IContainer) => scope.resolve(GetTodoHTTPRoute),
  addTodo: (scope: IContainer) => scope.resolve(AddTodoHTTPRoute),
  updateTodo: (scope: IContainer) => scope.resolve(UpdateTodoHTTPRoute),
  listTodo: (scope: IContainer) => scope.resolve(ListTodoHTTPRoute),
};
