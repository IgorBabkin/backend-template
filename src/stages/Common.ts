import { IContainer, IContainerModule, Provider, Registration as R } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';
import { FindTodoMiddleware } from '../useCase/todo/FindTodoMiddleware';
import { EntityManager } from '../lib/em/EntityManager';
import { IAliasMemoKey } from '../lib/container/Memo';
import { PersistReposUnitOfWork } from '../useCase/middleware/PersistReposUnitOfWork';
import { Authenticate } from '../useCase/middleware/Authenticate';
import { GenerateSubTodos } from '../useCase/todo/GenerateSubTodos';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .register(IAliasMemoKey.key, Provider.fromValue(new Map()))
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(PersistReposUnitOfWork))
      .add(R.fromClass(FindTodoMiddleware))
      .add(R.fromClass(Authenticate))
      .add(R.fromClass(GenerateSubTodos))
      .add(R.fromClass(EntityManager));
  }
}
