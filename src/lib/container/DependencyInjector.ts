import { constructor, getHooks, hook, IContainer, IInjector, ReflectionInjector } from 'ts-ioc-container';

export const onConstruct = hook('onConstruct');

export class DependencyInjector implements IInjector {
  private injector = new ReflectionInjector();

  resolve<T>(container: IContainer, value: constructor<T>, ...deps: unknown[]): T {
    const instance = this.injector.resolve(container, value, ...deps);
    for (const h of getHooks(instance as object, 'onConstruct')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance[h]();
    }
    return instance;
  }
}
