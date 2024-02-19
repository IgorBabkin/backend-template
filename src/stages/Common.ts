import { IContainer, IContainerModule, Provider, Registration } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { RequestMediator } from 'ts-request-mediator';
import { RequestContainer } from '../lib/container/RequestContainer';
import { IRequestMediatorKey } from '../lib/container/IRequestMediator';
import { TodoUnitOfWork } from '../useCase/todo/TodoUnitOfWork';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(Registration.fromClass(TodoRepo))
      .use(Registration.fromClass(TodoUnitOfWork))
      .register(IRequestMediatorKey, Provider.fromValue(new RequestMediator(new RequestContainer(container))));
  }
}
