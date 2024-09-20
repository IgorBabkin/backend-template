import { IEntity } from '../../lib/em/IEntity';

export interface ITodoValue {
  title: string;
  description: string;
}

export interface ITodo extends ITodoValue, IEntity {}
