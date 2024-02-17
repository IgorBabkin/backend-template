import { transaction } from 'ts-request-mediator';
import { inject } from 'ts-ioc-container';
import { instances } from '../../lib/container/di';

export abstract class UnitOfWork<TModel> {
  private instances = new Set<TModel>();

  public async save(): Promise<void> {
    for (const instance of this.instances) {
      await this.saveInstance(instance);
    }
  }

  protected abstract saveInstance<TModel>(instance: TModel): Promise<void>;
}

class Todo {
}

class TodoUnitOfWork extends UnitOfWork<Todo> {
  private instances = 'todo';

  async save(): Promise<void> {
  }
}

@transaction
export class PersistReposWithUnitOfWork {
  constructor(@inject(instances) private dependencies: unknown[]) {
  }

  async handle(): Promise<void> {
    for (const instance of this.dependencies) {
      if (instance instanceof UnitOfWork) {
        await instance.save();
      }
    }
  }
}
