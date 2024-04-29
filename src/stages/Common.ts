import { IContainer, IContainerModule, Provider, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { EntityManager } from '../lib/em/EntityManager';
import { IAliasMemoKey } from '../lib/container/Memo';
import { PersistReposUnitOfWork } from '../useCase/middleware/PersistReposUnitOfWork';
import { Authenticator } from '../domains/auth/IAuthenticator';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .register(IAliasMemoKey.key, Provider.fromValue(new Map()))
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(PersistReposUnitOfWork))
      .add(R.fromClass(Authenticator))
      .add(R.fromClass(EntityManager));
  }
}
