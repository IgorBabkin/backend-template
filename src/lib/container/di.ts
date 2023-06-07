import {
  asSingleton,
  Container,
  IContainer,
  IInjector,
  perTags,
  provider,
  Resolvable,
  Tag,
} from '@ibabkin/ts-ioc-container';
import { constructor } from '@ibabkin/ts-constructor-injector';
import { Scope } from '@ibabkin/ts-request-mediator';

export const injector: IInjector = {
  resolve<T>(container: IContainer, value: constructor<T>, ...deps: unknown[]): T {
    return container.resolve(value, ...deps);
  },
};

export function createContainer(tags: Tag): IContainer {
  return new Container({
    resolve<T>(container: IContainer, value: constructor<T>, ...deps: unknown[]): T {
      return container.resolve(value, ...deps);
    },
  });
}

export type Resolver<Result> = (scope: Resolvable) => Result;

export const perApplication = provider(asSingleton(), perTags(Scope.Application));
