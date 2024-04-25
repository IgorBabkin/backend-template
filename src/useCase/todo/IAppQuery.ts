import { Entity, ID } from '../../lib/em/IEntity';
import { ITodo } from '../../domains/todo/ITodo';

export interface ITodoQuery {
  todoID: ID;
}

export type WithTodo<T> = T extends ITodoQuery ? T & { todo: Entity<ITodo> } : T;

export type IAppQuery<T> = WithTodo<T>;
