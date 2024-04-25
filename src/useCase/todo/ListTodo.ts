import { ListTodoResponse } from '../../.generated/operations';
import { IMiddleware, IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { AppQuery } from './FindTodo';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { by, inject } from 'ts-ioc-container';
import { request } from '../../lib/container/OperationProvider';
import * as console from 'node:console';

interface Query {}

export interface IListTodo extends IQueryHandler<Query, ListTodoResponse> {}

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
  async handle({}: AppQuery<Query>): Promise<ListTodoResponse> {
    return await this.todoRepo.findAll();
  }
}
