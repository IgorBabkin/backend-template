import { WithTodo } from './todo/ITodoQuery';

export interface IAuthQuery {
  // authToken: string;
}

export type WithAuthUser<T> = T extends IAuthQuery ? T & { authUserID: string } : T;

export type IAppQuery<T> = WithTodo<T>;
