import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { EntityManager } from '../lib/em/EntityManager';
import { PersistReposUnitOfWork } from '../useCase/middleware/PersistReposUnitOfWork';
import { Authenticator } from '../domains/auth/IAuthenticator';
import { RouteResponse } from '../lib/express/HTTPResponse';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .addRegistration(R.fromClass(TodoRepo))
      .addRegistration(R.fromClass(PersistReposUnitOfWork))
      .addRegistration(R.fromClass(Authenticator))
      .addRegistration(R.fromClass(RouteResponse))
      .addRegistration(R.fromClass(EntityManager));
  }
}
