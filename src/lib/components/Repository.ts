import { IProvider, IRegistration, Provider } from 'ts-ioc-container';
import { IRepository } from '../em/IRepository';
import { mapPrismaError } from '../prisma/handlePrismaError';

const mapProvider = (provider: IProvider<IRepository>): IProvider<IRepository> =>
  new Provider((container, options) => {
    const instance = provider.resolve(container, options);
    return new Proxy(instance, {
      get(target, prop) {
        const value = target[prop as keyof IRepository];
        if (value instanceof Function) {
          return function (...args: unknown[]) {
            const result = (value as (...args: unknown[]) => unknown).apply(target, args);
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
  });
export const repository = {
  mapRegistration: (r: IRegistration): IRegistration => r.pipe(mapProvider),
  mapProvider,
};
