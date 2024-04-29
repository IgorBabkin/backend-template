import { by, IContainer, inject } from 'ts-ioc-container';
import { request } from '../../../lib/components/Operation';
import { IMiddleware, IQueryHandler } from '../../../lib/mediator/IQueryHandler';
import console from 'node:console';
import { MainHandler } from '../../MainHandler';
import { ITodo } from '../../../domains/todo/ITodo';
import { ITodoRepo, ITodoRepoKey } from '../../../domains/todo/TodoRepo';
import { IAppQuery } from '../../IAppQuery';

interface Query {}

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
export class ListTodo extends MainHandler<Query, ITodo[]> implements IQueryHandler<Query, ITodo[]> {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo, @inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected async process(query: IAppQuery<Query>): Promise<ITodo[]> {
    return await this.todoRepo.findAll();
  }
}
