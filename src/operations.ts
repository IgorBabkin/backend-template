import { Operations } from './.generated/operations';
import { IMediator } from 'ts-request-mediator';
import { todos } from './useCase/todo/todos';

export function operations(mediator: IMediator): Operations {
  return {
    ...todos(mediator),
  };
}
