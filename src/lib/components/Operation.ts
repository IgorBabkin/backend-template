import { by, constructor, IContainer, inject, InjectionToken } from 'ts-ioc-container';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';
import { getProp, prop } from '../metadata';
import { IMiddleware, IQueryHandler, useMiddleware } from '../mediator/IQueryHandler';
import { Middleware } from './Middleware';

export class Operation<TQuery, TResponse> implements IQueryHandler<TQuery, TResponse> {
  private mediator: IMediator;

  constructor(
    private fn: () => IQueryHandler<TQuery, TResponse>,
    @inject(useMiddleware(['middleware-before'], ['common'])) private beforeMiddleware: IMiddleware[],
    @inject(useMiddleware(['middleware-after'], ['common'])) private afterMiddleware: IMiddleware[],
    @inject(by.scope.current) private requestScope: IContainer,
  ) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(query: TQuery): Promise<TResponse> {
    const handler = this.fn();

    const beforeHooks = this.beforeMiddleware.concat(this.getBeforeHooks(handler));
    for (const middleware of beforeHooks) {
      await middleware.handle({ query, resource: handler, result: undefined });
    }

    const result = await this.mediator.send(handler, query);

    const afterHooks = this.afterMiddleware.concat(this.getAfterHooks(handler));
    for (const middleware of afterHooks) {
      await middleware.handle({ query, resource: handler, result });
    }

    return result;
  }

  private getAfterHooks<TQuery, TResponse>(UseCase: IQueryHandler<TQuery, TResponse>): IMiddleware[] {
    const items =
      getProp<constructor<IMiddleware>[]>(
        UseCase.constructor as constructor<unknown>,
        createHookMetadataKey('RequestMediator/', 'after'),
      ) ?? [];
    return items.map((item) =>
      this.requestScope.resolve(Middleware, { args: [() => this.requestScope.resolve(item)] }),
    );
  }

  private getBeforeHooks<TQuery, TResponse>(UseCase: IQueryHandler<TQuery, TResponse>): IMiddleware[] {
    const items =
      getProp<constructor<IMiddleware>[]>(
        UseCase.constructor as constructor<unknown>,
        createHookMetadataKey('RequestMediator/', 'before'),
      ) ?? [];
    return items.map((item) =>
      this.requestScope.resolve(Middleware, { args: [() => this.requestScope.resolve(item)] }),
    );
  }
}

const createHookMetadataKey = (prefix: string, key: 'before' | 'after') => `${prefix}${key}`;

export function request(key: 'before' | 'after', value: constructor<IMiddleware>[]) {
  return prop(createHookMetadataKey('RequestMediator/', key), value);
}

export const useOperation =
  <T extends IQueryHandler>(Target: InjectionToken<T>) =>
  (requestScope: IContainer) =>
    requestScope.resolve(Operation, { args: [() => requestScope.resolve(Target)] });
