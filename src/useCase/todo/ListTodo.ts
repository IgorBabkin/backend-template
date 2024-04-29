import { IMiddleware, IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { by, inject } from 'ts-ioc-container';
import { request } from '../../lib/mediator/OperationProvider';
import * as console from 'node:console';
import { IAppQuery } from '../middleware/IAppQuery';
import { ITodo } from '../../domains/todo/ITodo';

interface Query {}

export interface IListTodo extends IQueryHandler<Query, ITodo[]> {}

export class LogBefore implements IMiddleware {
  async handle(): Promise<void> {
    console.log('LogBefore middleware');
  }
}

export class LogAfter implements IMiddleware {
  async handle(): Promise<void> {
    console.log('LogAfter middleware');
  }
}

@request('before', [LogBefore])
@request('after', [LogAfter])
export class ListTodo implements IListTodo {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo) {}

  // eslint-disable-next-line no-empty-pattern
  async handle({}: IAppQuery<Query>): Promise<ITodo[]> {
    return await this.todoRepo.findAll();
  }
}
