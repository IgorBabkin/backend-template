import { by, constructor, IContainer, inject, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { TransactionMediator } from '../mediator/transaction/TransactionMediator';
import { SimpleMediator } from '../mediator/SimpleMediator';
import { IMediator } from '../mediator/IMediator';
import { getProp, prop } from '../metadata';
import { IMiddleware, IQueryHandler } from '../mediator/IQueryHandler';
import { undefined } from 'zod';
import { Middleware } from './Middleware';
import { requestContext } from './RequestContext';
import { byAliases } from './di';
import { MapFn } from 'ts-ioc-container/typings/utils';

export interface IHook {
  before: constructor<IMiddleware>[];
  after: constructor<IMiddleware>[];
}

export class Operation<TQuery, TResponse> implements IQueryHandler<TQuery, TResponse> {
  private mediator: IMediator;

  constructor(
    private fn: () => IQueryHandler<TQuery, TResponse>,
    @inject(byAliases(['middleware', 'before', 'common'])) private beforeMiddleware: IMiddleware[],
    @inject(byAliases(['middleware', 'after', 'common'])) private afterMiddleware: IMiddleware[],
    @inject(byAliases(['middleware', 'before'], requestContext('tags')))
    private beforeTaggedMiddleware: IMiddleware[],
    @inject(byAliases(['middleware', 'after'], requestContext('tags')))
    private afterTaggedMiddleware: IMiddleware[],
    @inject(by.scope.current) private requestScope: IContainer,
  ) {
    this.mediator = new TransactionMediator(new SimpleMediator(), requestScope);
  }

  async handle(query: TQuery): Promise<TResponse> {
    const handler = this.fn();

    const beforeHooks = this.beforeMiddleware.concat(this.beforeTaggedMiddleware).concat(this.getBeforeHooks(handler));
    for (const middleware of beforeHooks) {
      await middleware.handle(query, handler, undefined);
    }

    const result = await this.mediator.send(handler, query);

    const afterHooks = this.afterMiddleware.concat(this.afterTaggedMiddleware).concat(this.getAfterHooks(handler));
    for (const middleware of afterHooks) {
      await middleware.handle(query, handler, result);
    }

    return result;
  }

  private getAfterHooks<TQuery, TResponse>(UseCase: IQueryHandler<TQuery, TResponse>): IMiddleware[] {
    const items =
      getProp<constructor<IMiddleware>[]>(UseCase, createHookMetadataKey('RequestMediator/', 'after')) ?? [];
    return items.map((item) => new Middleware(() => this.requestScope.resolve(item)));
  }

  private getBeforeHooks<TQuery, TResponse>(UseCase: IQueryHandler<TQuery, TResponse>): IMiddleware[] {
    const items =
      getProp<constructor<IMiddleware>[]>(UseCase, createHookMetadataKey('RequestMediator/', 'before')) ?? [];
    return items.map((item) => new Middleware(() => this.requestScope.resolve(item)));
  }
}

const createHookMetadataKey = <K extends keyof IHook>(prefix: string, key: K) => `${prefix}${key}`;

export function request<K extends keyof IHook>(key: K, value: IHook[K]) {
  return prop(createHookMetadataKey('RequestMediator/', key), value);
}

export const operation: MapFn<IProvider> = (provider) => new OperationProvider(provider as IProvider<IQueryHandler>);

class OperationProvider extends ProviderDecorator<IQueryHandler> {
  constructor(private provider: IProvider<IQueryHandler>) {
    super(provider);
  }

  resolve(requestScope: IContainer, ...args: unknown[]): IQueryHandler {
    return requestScope.resolve(Operation, { args: [() => this.provider.resolve(requestScope, ...args)] });
  }
}
