import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { RequestMediator } from 'ts-request-mediator';
import { RequestContainer } from '../lib/container/RequestContainer';
import { IRequestMediatorKey } from '../lib/container/IRequestMediator';
import { TodoUnitOfWork } from '../useCase/todo/TodoUnitOfWork';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromClass(TodoRepo))
      .use(R.fromClass(TodoUnitOfWork))
      .use(R.fromValue(new RequestMediator(new RequestContainer(container))).to(IRequestMediatorKey));
  }
}
