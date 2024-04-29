import { IContainer, IContainerModule, IMemo, IMemoKey, Provider, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { EntityManager } from '../lib/em/EntityManager';
import { PersistReposUnitOfWork } from '../useCase/middleware/PersistReposUnitOfWork';
import { Authenticator } from '../domains/auth/IAuthenticator';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .register(IMemoKey, Provider.fromValue<IMemo>(new Map()))
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(PersistReposUnitOfWork))
      .add(R.fromClass(Authenticator))
      .add(R.fromClass(EntityManager));
  }
}
