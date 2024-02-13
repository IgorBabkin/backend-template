import { Operations } from './.generated/operations';
import { todos } from './useCase/todo/todos';
import { IContainer } from 'ts-ioc-container';

export const operations = (container: IContainer): Operations => ({
  ...todos(container),
});
