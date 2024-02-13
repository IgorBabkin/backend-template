import { IDependencyContainer } from 'ts-request-mediator';
import { IContainer, Provider, constructor, inject } from 'ts-ioc-container';
import { disposeContainer, scope } from './di';

export class RequestContainer implements IDependencyContainer {
  constructor(@inject(scope) private container: IContainer) {}

  createScope(tags: string[]): IDependencyContainer {
    return new RequestContainer(this.container.createScope(...tags));
  }

  dispose(): void {
    this.container.dispose();
  }

  onBeforeDispose(): Promise<void> {
    return disposeContainer(this.container);
  }

  registerValue(key: string | symbol, value: unknown): void {
    this.container.register(key, Provider.fromValue(value));
  }

  resolve<T>(key: constructor<T> | symbol): T {
    return this.container.resolve(key);
  }
}
