import { IContainer, IContainerModule, Provider, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { FindTodo } from '../useCase/todo/FindTodo';
import { EntityManager } from '../lib/em/EntityManager';
import { IAliasMemoKey } from '../lib/container/Memo';
import { PersistReposUnitOfWork } from '../useCase/PersistReposUnitOfWork';
import { Authenticate } from '../useCase/Authenticate';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .register(IAliasMemoKey.key, Provider.fromValue(new Map()))
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(PersistReposUnitOfWork))
      .add(R.fromClass(FindTodo))
      .add(R.fromClass(Authenticate))
      .add(R.fromClass(EntityManager));
  }
}
