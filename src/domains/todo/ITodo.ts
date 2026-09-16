import { IEntity } from '../../lib/em/Entity';

export interface ITodoValue {
  title: string;
  description: string;
}

export interface ITodo extends ITodoValue, IEntity {}
