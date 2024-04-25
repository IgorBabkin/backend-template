import { by, IContainer, inject, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { TransactionMediator } from './transaction/TransactionMediator';
import { SimpleMediator } from './SimpleMediator';
import { IMediator } from './IMediator';
import { IQueryHandler } from './IQueryHandler';

export class Service<TQuery = unknown, TResponse = unknown> implements IQueryHandler<TQuery, TResponse> {
  private mediator: IMediator;

  constructor(private fn: () => IQueryHandler<TQuery, TResponse>, @inject(by.scope.current) requestScope: IContainer) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(query: TQuery): Promise<TResponse> {
    const handler = this.fn();
    return await this.mediator.send(handler, query);
  }
}

export class ServiceProvider extends ProviderDecorator<IQueryHandler> {
  constructor(private provider: IProvider<IQueryHandler>) {
    super(provider);
  }

  resolve(requestScope: IContainer, ...args: unknown[]): IQueryHandler {
    return requestScope.resolve(Service, { args: [() => this.provider.resolve(requestScope, ...args)] });
  }
}

export const service = (provider: IProvider) => new ServiceProvider(provider as IProvider<IQueryHandler>);
