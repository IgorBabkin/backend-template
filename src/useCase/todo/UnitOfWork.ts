import { InstancePredicate } from 'ts-ioc-container';

export abstract class UnitOfWork<TModel = unknown> {
  private instances = new Set<TModel>();

  async save(): Promise<void> {
    for (const instance of this.instances) {
      await this.saveInstance(instance);
    }
  }

  protected abstract saveInstance(instance: TModel): Promise<void>;
}

export const isUnitOfWork: InstancePredicate = (instance) => instance instanceof UnitOfWork;
