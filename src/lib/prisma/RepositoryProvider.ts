import { IContainer, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { IRepository } from '../em/IRepository';
import { mapPrismaError } from './handlePrismaError';

export class RepositoryProvider extends ProviderDecorator<IRepository> {
  constructor(private provider: IProvider<IRepository>) {
    super(provider);
  }

  resolve(container: IContainer, ...args: unknown[]): IRepository {
    const instance = this.provider.resolve(container, ...args);
    return new Proxy(instance, {
      get(target, prop) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = target[prop];
        if (value instanceof Function) {
          return function (...args: unknown[]) {
            const result = value.apply(target, args);
            if (result instanceof Promise) {
              return result.catch(mapPrismaError);
            }
            return result;
          };
        }
        return value;
      },
    });
  }
}

export const repository = (provider: IProvider) => new RepositoryProvider(provider as IProvider<IRepository>);
