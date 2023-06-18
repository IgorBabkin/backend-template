import { IContainer, IContainerModule, Registration } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { TodoRepo } from '../domains/todo/TodoRepo';

export class Common implements IContainerModule {
  constructor(env: IEnv) {}

  applyTo(container: IContainer): void {
    container.add(Registration.fromClass(TodoRepo));
  }
}
