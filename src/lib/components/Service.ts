import { IContainer, inject, IProvider, Provider, select } from 'ts-ioc-container';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';
import { IQueryHandler } from '../mediator/IQueryHandler';

export class Service<TQuery = unknown, TResponse = unknown> implements IQueryHandler<TQuery, TResponse> {
  private mediator: IMediator;

  constructor(
    private fn: () => IQueryHandler<TQuery, TResponse>,
    @inject(select.scope.current) requestScope: IContainer,
  ) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(query: TQuery): Promise<TResponse> {
    const handler = this.fn();
    return await this.mediator.send(handler, query);
  }
}

export const service = (provider: IProvider) =>
  new Provider((requestScope, options) =>
    requestScope.resolve(Service, { args: [() => provider.resolve(requestScope, options)] }),
  );
