import { alias, by, inject, provider, register, scope } from 'ts-ioc-container';
import { EntityManager, isEntityManager } from '../lib/em/EntityManager';
import { transaction } from '../lib/mediator/transaction/ITransactionContext';
import { Scope } from '../lib/mediator/Scope';
import { middleware } from '../lib/container/Middleware';

@transaction
@register(scope((s) => s.hasTag(Scope.Request)))
@provider(middleware, alias('middleware', 'after', 'common'))
export class PersistReposUnitOfWork {
  constructor(@inject(by.instances(isEntityManager)) private ems: EntityManager[]) {}

  async handle(): Promise<void> {
    for (const em of this.ems) {
      await em.persistAll();
    }
  }
}
