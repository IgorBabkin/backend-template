import { Entity, ID } from '../../lib/em/IEntity';
import { ITodo } from '../../domains/todo/ITodo';

export interface ITodoQuery {
  todoID: ID;
}

export function isTodoQuery(query: unknown): query is ITodoQuery {
  return 'todoID' in (query as any);
}

export type WithTodo<T> = T extends ITodoQuery ? T & { todo: Entity<ITodo> } : T;
