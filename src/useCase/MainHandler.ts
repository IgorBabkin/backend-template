import { IAppQuery } from './IAppQuery';
import { entityManager, EntityManager } from '../lib/em/EntityManager';
import { ITodoRepo, ITodoRepoKey } from '../domains/todo/TodoRepo';
import { IContainer } from 'ts-ioc-container';
import { omitUndefined } from '../lib/utils';
import { isTodoQuery } from './todo/ITodoQuery';

export abstract class MainHandler<TQuery extends NonNullable<unknown>, TResponse> {
  private todoRepoEntityManager: EntityManager<ITodoRepo>;

  protected constructor(scope: IContainer) {
    this.todoRepoEntityManager = entityManager(ITodoRepoKey)(scope) as EntityManager<ITodoRepo>;
  }

  async handle(query: TQuery): Promise<TResponse> {
    return this.process(
      omitUndefined({
        ...query,
        todo: isTodoQuery(query) ? await this.todoRepoEntityManager.findByIdOrFail(query.todoID) : undefined,
      }) as unknown as IAppQuery<TQuery>,
    );
  }

  protected abstract process(query: IAppQuery<TQuery>): Promise<TResponse>;
}
