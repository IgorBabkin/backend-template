import { Entity, ID } from '../../lib/em/IEntity';
import { ITodo } from '../../domains/todo/ITodo';

export interface ITodoQuery {
  todoID: ID;
}

export function isTodoQuery(query: unknown): query is ITodoQuery {
  return 'todoID' in (query as any);
}

export type WithTodo<T> = T extends ITodoQuery ? T & { todo: Entity<ITodo> } : T;

export interface IAuthQuery {
  authToken: string;
}

export type WithAuthUser<T> = T extends IAuthQuery ? T & { authUserID: string } : T;

export type IAppQuery<T> = WithTodo<T>;
