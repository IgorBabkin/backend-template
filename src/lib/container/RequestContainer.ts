import { IDependencyContainer } from 'ts-request-mediator';
import { constructor, IContainer, Provider } from 'ts-ioc-container';

export class RequestContainer implements IDependencyContainer {
  constructor(private container: IContainer) {}

  createScope(tags: string[]): IDependencyContainer {
    return new RequestContainer(this.container.createScope(...tags));
  }

  dispose(): void {
    this.container.dispose();
  }

  registerValue(key: string | symbol, value: unknown): void {
    this.container.register(key, Provider.fromValue(value));
  }

  resolve<T>(key: constructor<T> | symbol): T {
    return this.container.resolve(key);
  }
}
