import { by, inject, register, scope } from 'ts-ioc-container';
import { EntityManager, isEntityManager } from '../../lib/em/EntityManager';
import { transaction } from '../../lib/mediator/transaction/ITransactionContext';
import { perScope } from '../../lib/mediator/Scope';
import { asMiddleware } from '../../lib/mediator/Middleware';

@transaction
@register(scope(perScope.Request))
@asMiddleware('middleware-after', 'common')
export class PersistReposUnitOfWork {
  constructor(@inject(by.instances(isEntityManager)) private ems: EntityManager[]) {}

  async handle(): Promise<void> {
    for (const em of this.ems) {
      await em.persistAll();
    }
  }
}
