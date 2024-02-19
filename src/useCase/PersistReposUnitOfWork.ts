import { transaction } from 'ts-request-mediator';
import { by, inject } from 'ts-ioc-container';
import { isUnitOfWork, UnitOfWork } from './todo/UnitOfWork';

@transaction
export class PersistReposUnitOfWork {
  constructor(@inject(by.instances(isUnitOfWork)) private unitOfWorks: UnitOfWork[]) {}

  async handle(): Promise<void> {
    for (const instance of this.unitOfWorks) {
      await instance.save();
    }
  }
}
