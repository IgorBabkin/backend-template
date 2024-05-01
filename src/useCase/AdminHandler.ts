import { IAppQuery, IAuthQuery, WithAuthUser } from './IAppQuery';
import { IAuthenticator, IAuthenticatorKey } from '../domains/auth/IAuthenticator';
import { entityManager, EntityManager } from '../lib/em/EntityManager';
import { ITodoRepo, ITodoRepoKey } from '../domains/todo/TodoRepo';
import { IContainer } from 'ts-ioc-container';
import { omitUndefined } from '../lib/utils';
import { isTodoQuery } from './todo/ITodoQuery';

export abstract class AdminHandler<TQuery extends IAuthQuery, TResponse> {
  private authenticator: IAuthenticator;
  private todoRepoEntityManager: EntityManager<ITodoRepo>;

  protected constructor(scope: IContainer) {
    this.authenticator = IAuthenticatorKey.resolve(scope);
    this.todoRepoEntityManager = entityManager(ITodoRepoKey)(scope) as EntityManager<ITodoRepo>;
  }

  async handle(query: TQuery): Promise<TResponse> {
    return this.process(
      omitUndefined({
        ...query,
        // authUserID: await this.authenticator.getUser(query.authToken),
        todo: isTodoQuery(query) ? await this.todoRepoEntityManager.findByIdOrFail(query.todoID) : undefined,
      }) as unknown as WithAuthUser<IAppQuery<TQuery>>,
    );
  }

  protected abstract process(query: WithAuthUser<IAppQuery<TQuery>>): Promise<TResponse>;
}
