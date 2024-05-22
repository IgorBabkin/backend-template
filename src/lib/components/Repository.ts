import { IContainer, IProvider, ProviderDecorator, ProviderResolveOptions } from 'ts-ioc-container';
import { IRepository } from '../em/IRepository';
import { mapPrismaError } from '../prisma/handlePrismaError';

export class RepositoryProvider extends ProviderDecorator<IRepository> {
  constructor(private provider: IProvider<IRepository>) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): IRepository {
    const instance = this.provider.resolve(container, options);
    return new Proxy(instance, {
      get(target, prop, receiver) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = target[prop];
        if (value instanceof Function) {
          return function (...args: unknown[]) {
            const result = value.apply(target, args);
            if (result instanceof Promise) {
              return result.catch((e) =>
                mapPrismaError(e, { method: prop.toString(), target: target.constructor.name }),
              );
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
