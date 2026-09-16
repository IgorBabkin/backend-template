import { arg, IContainer, inject, select } from 'ts-ioc-container';
import { IMiddleware, MiddlewarePayload } from '../mediator/IQueryHandler';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';

type MiddlewareContext = {
  handler: IMiddleware;
};

export class Middleware implements IMiddleware {
  private readonly mediator: IMediator;
  private readonly handler: IMiddleware;

  constructor(@inject(arg(0)) context: MiddlewareContext, @inject(select.scope.current) requestScope: IContainer) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
    this.handler = context.handler;
  }

  async handle(payload: MiddlewarePayload): Promise<void> {
    return await this.mediator.send(this.handler, payload);
  }
}

export const asMiddleware = (dep: unknown, s: IContainer) => s.resolve(Middleware, { args: [{ handler: dep }] });
