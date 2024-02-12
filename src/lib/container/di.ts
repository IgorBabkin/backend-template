import { Container, getHooks, hook, IContainer, provider, Resolvable, singleton, Tag, tags } from 'ts-ioc-container';
import { Scope } from 'ts-request-mediator';
import { DependencyInjector } from './DependencyInjector';

export const createContainer = (...tags: Tag[]) => new Container(new DependencyInjector(), { tags });

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

export const perApplication = provider(singleton(), tags(Scope.Application));
export const perRequest = provider(singleton(), tags(Scope.Request));
export const perUseCase = provider(singleton(), tags(Scope.UseCase));
export const perService = provider(singleton(), tags(Scope.Service));
export const asSingleton = provider(singleton());
