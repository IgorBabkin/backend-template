import { IContainer, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { IMiddleware } from '../mediator/IQueryHandler';
import { MapFn } from 'ts-ioc-container/typings/utils';

export class Middleware implements IMiddleware {
  constructor(private fn: () => IMiddleware) {}

  async handle(query: unknown, resource: unknown, result: unknown): Promise<void> {
    const handler = this.fn();
    await handler.handle(query, resource, result);
  }
}

export const middleware: MapFn<IProvider> = (provider) => new MiddlewareProvider(provider as IProvider<IMiddleware>);

export class MiddlewareProvider extends ProviderDecorator<IMiddleware> {
  constructor(private provider: IProvider<IMiddleware>) {
    super(provider);
  }

  resolve(requestScope: IContainer, ...args: unknown[]): IMiddleware {
    return requestScope.resolve(Middleware, { args: [() => this.provider.resolve(requestScope, ...args)] });
  }
}
