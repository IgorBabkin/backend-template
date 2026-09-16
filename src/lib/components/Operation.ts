import { arg, constructor, IContainer, inject, Is, select } from 'ts-ioc-container';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';
import { getProp, prop } from '../metadata';
import { IMiddleware, IMiddlewareAfterKey, IMiddlewareBeforeKey, IQueryHandler } from '../mediator/IQueryHandler';
import { Middleware } from './Middleware';

type OperationContext<Handler> = {
  handler: Handler;
};

export class Operation<Handler extends IQueryHandler<TQuery, TResponse>, TQuery = any, TResponse = any>
  implements IQueryHandler<TQuery, TResponse>
{
  private mediator: IMediator;
  private readonly handler: Handler;

  constructor(
    @inject(arg(0)) context: OperationContext<Handler>,
    @inject(IMiddlewareBeforeKey.lazy()) private beforeMiddleware: IMiddleware[],
    @inject(IMiddlewareAfterKey.lazy()) private afterMiddleware: IMiddleware[],
    @inject(select.scope.current) private requestScope: IContainer,
  ) {
    this.handler = Is.constructor(context.handler)
      ? requestScope.resolve(context.handler as constructor<Handler>)
      : context.handler;
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(query: TQuery): Promise<TResponse> {
    for (const middleware of [...this.beforeMiddleware, ...this.getHooks(this.handler, 'before')]) {
      await middleware.handle({ resource: this.handler });
    }

    const result = await this.mediator.send(this.handler, query);

    for (const middleware of [...this.getHooks(this.handler, 'after'), ...this.afterMiddleware]) {
      await middleware.handle({ resource: this.handler });
    }

    return result;
  }

  private getHooks<TQuery, TResponse>(
    useCase: IQueryHandler<TQuery, TResponse>,
    hook: 'before' | 'after',
  ): IMiddleware[] {
    const items: constructor<IMiddleware>[] =
      getProp(useCase.constructor, createHookMetadataKey('RequestMediator/', hook)) ?? [];
    return items.map((Target) =>
      this.requestScope.resolve(Middleware, {
        args: [{ handler: this.requestScope.resolve(Target, { lazy: true }) }],
      }),
    );
  }
}

const createHookMetadataKey = (prefix: string, key: 'before' | 'after') => `${prefix}${key}`;

export function request(key: 'before' | 'after', value: constructor<IMiddleware>[]) {
  return prop(createHookMetadataKey('RequestMediator/', key), value);
}
