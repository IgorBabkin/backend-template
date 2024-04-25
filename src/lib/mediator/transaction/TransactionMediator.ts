import { IMediator } from '../IMediator';
import { IQueryHandler } from '../IQueryHandler';
import { isTransaction, ITransactionContext, ITransactionContextKey } from './ITransactionContext';
import { constructor, IContainer, Provider } from 'ts-ioc-container';

export class TransactionMediator implements IMediator {
  constructor(private mediator: IMediator, private scope: IContainer) {}

  async send<TResponse, TQuery>(handler: IQueryHandler<TQuery, TResponse>, query: TQuery): Promise<TResponse> {
    if (isTransaction(handler.constructor as constructor<unknown>)) {
      const parentContext = this.scope.resolve<ITransactionContext>(ITransactionContextKey);
      const transactionScope = this.scope.createScope('transaction');
      try {
        return await parentContext.execute((childContext) => {
          this.scope.register(ITransactionContextKey, Provider.fromValue(childContext));
          return this.mediator.send(handler, query);
        });
      } finally {
        transactionScope.dispose();
      }
    }

    return this.mediator.send(handler, query);
  }
}
