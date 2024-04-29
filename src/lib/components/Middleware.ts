import { alias, by, IContainer, inject, IProvider, provider, ProviderDecorator } from 'ts-ioc-container';
import { IMiddleware, MiddlewarePayload } from '../mediator/IQueryHandler';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';

export class Middleware implements IMiddleware {
  private mediator: IMediator;

  constructor(private fn: () => IMiddleware, @inject(by.scope.current) requestScope: IContainer) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(payload: MiddlewarePayload): Promise<void> {
    const handler = this.fn();
    return await this.mediator.send(handler, payload);
  }
}

const middleware = (provider: IProvider) => new MiddlewareProvider(provider as IProvider<IMiddleware>);

export const asMiddleware = (...aliases: string[]) => provider(middleware, alias(...aliases));

export class MiddlewareProvider extends ProviderDecorator<IMiddleware> {
  constructor(private provider: IProvider<IMiddleware>) {
    super(provider);
  }

  resolve(requestScope: IContainer, ...args: unknown[]): IMiddleware {
    return requestScope.resolve(Middleware, { args: [() => this.provider.resolve(requestScope, ...args)] });
  }
}
