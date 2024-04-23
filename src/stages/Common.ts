import { IContainer, IContainerModule, Provider, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { TodoUnitOfWork } from '../useCase/todo/TodoUnitOfWork';
import { FindTodo } from '../useCase/todo/FindTodo';
import { EntityManager } from '../lib/em/EntityManager';
import { Scope } from '../lib/mediator/Scope';
import { IAliasMemoKey } from '../lib/container/Memo';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .register(IAliasMemoKey.key, Provider.fromValue(new Map()))
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(TodoUnitOfWork))
      .add(R.fromValue(FindTodo).when((s) => s.hasTag(Scope.Application)))
      .add(R.fromClass(EntityManager));
  }
}
