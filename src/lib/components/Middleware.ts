import { alias, by, constructor, decorate, IContainer, inject, provider } from 'ts-ioc-container';
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
    alias(...aliases),
  );

export const resolveMiddleware = (scope: IContainer, Target: constructor<IMiddleware>, options: { lazy?: boolean }) =>
  scope.resolve(Middleware, { args: [by.key(Target, options)(scope)] });
