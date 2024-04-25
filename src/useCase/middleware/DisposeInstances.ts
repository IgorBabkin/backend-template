import { by, getHooks, hook, inject } from 'ts-ioc-container';

export const onDispose = hook('onDispose');

export class DisposeInstances {
  constructor(@inject(by.instances()) private instances: unknown[]) {}

  async handle(): Promise<void> {
    for (const instance of this.instances) {
      for (const h of getHooks(instance as object, 'onDispose')) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await instance[h]();
      }
    }
  }
}
