import { by, IContainer, inject, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';
import { IQueryHandler } from '../mediator/IQueryHandler';
import { ProviderResolveOptions } from 'ts-ioc-container/typings/provider/IProvider';

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

  resolveInstantly(requestScope: IContainer, options: ProviderResolveOptions): IQueryHandler {
    return requestScope.resolve(Service, { args: [() => this.provider.resolve(requestScope, options)] });
  }
}

export const service = (provider: IProvider) => new ServiceProvider(provider as IProvider<IQueryHandler>);
