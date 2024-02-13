import { Operations } from './.generated/operations';
import { IContainer } from 'ts-ioc-container';
import { GetTodoHTTPRoute } from './useCase/todo/GetTodoRoute';
import { AddTodoHTTPRoute } from './useCase/todo/AddTodoRoute';

export const operations = (container: IContainer): Operations => ({
  getTodo: container.resolve(GetTodoHTTPRoute),
  addTodo: container.resolve(AddTodoHTTPRoute),
});
