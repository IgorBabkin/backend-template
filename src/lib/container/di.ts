import { asSingleton, Container, IContainer, perTags, provider, Resolvable, Tag } from 'ts-ioc-container';
import { constructor, getHooks, hook, resolve } from 'ts-constructor-injector';
import { Scope } from 'ts-request-mediator';

export const onConstruct = hook('onConstruct');

export function createContainer(tags: Tag[]): IContainer {
  return new Container(
    {
      resolve<T>(container: IContainer, value: constructor<T>, ...deps: unknown[]): T {
        const instance = resolve(container)(value, ...deps);
        for (const h of getHooks(instance as object, 'onConstruct')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          instance[h]();
        }
        return instance;
      },
    },
    { tags },
  );
}

export const onDispose = hook('onDispose');

export async function disposeContainer(container: IContainer): Promise<void> {
  for (const instance of container.getInstances()) {
    for (const h of getHooks(instance as object, 'onDispose')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await instance[h]();
    }
  }
}

export type Resolver<Result> = (scope: Resolvable) => Result;

export const perApplication = provider(asSingleton(), perTags(Scope.Application));
export const perRequest = provider(asSingleton(), perTags(Scope.Request));
export const perUseCase = provider(asSingleton(), perTags(Scope.UseCase));
export const perService = provider(asSingleton(), perTags(Scope.Service));
export const singleton = provider(asSingleton());

export const byArr =
  <T>(...values: constructor<T>[]): Resolver<T[]> =>
  (container) =>
    values.map((value) => container.resolve(value));
