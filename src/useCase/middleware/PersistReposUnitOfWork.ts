import { decorate, inject, register, scope, select } from 'ts-ioc-container';
import { EntityManager, isEntityManager } from '../../lib/em/EntityManager';
import { transaction } from '../../lib/mediator/transaction/ITransactionContext';
import { perScope } from '../../lib/components/Scope';
import { IMiddlewareAfterKey } from '../../lib/mediator/IQueryHandler';
import { asMiddleware } from '../../lib/components/Middleware';

@transaction
@register(scope(perScope.Request), IMiddlewareAfterKey, decorate(asMiddleware))
export class PersistReposUnitOfWork {
  constructor(@inject(select.instances(isEntityManager)) private ems: EntityManager[]) {}

  async handle(): Promise<void> {
    for (const em of this.ems) {
      await em.persistAll();
    }
  }
}
