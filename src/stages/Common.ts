import { IContainer, IContainerModule, Registration } from 'ts-ioc-container';
import { TodoRepo } from '../domains/todo/TodoRepo';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container.use(Registration.fromClass(TodoRepo));
  }
}
