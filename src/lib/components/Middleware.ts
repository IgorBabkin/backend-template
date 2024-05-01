import { alias, by, decorate, IContainer, inject, lazy, provider } from 'ts-ioc-container';
import { IMiddleware, MiddlewarePayload } from '../mediator/IQueryHandler';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';

export class Middleware implements IMiddleware {
  private mediator: IMediator;

  constructor(private handler: IMiddleware, @inject(by.scope.current) requestScope: IContainer) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(payload: MiddlewarePayload): Promise<void> {
    return await this.mediator.send(this.handler, payload);
  }
}

export const asMiddleware = (...aliases: string[]) =>
  provider(
    decorate((dep, s) => s.resolve(Middleware, { args: [dep] })),
    lazy,
    alias(...aliases),
  );
