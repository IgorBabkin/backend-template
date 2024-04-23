import { IContainer, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { IMiddleware, MiddlewarePayload } from '../mediator/IQueryHandler';

export class Middleware implements IMiddleware {
  constructor(private fn: () => IMiddleware) {}

  async handle(payload: MiddlewarePayload): Promise<void> {
    const handler = this.fn();
    await handler.handle(payload);
  }
}

export const middleware = (provider: IProvider) => new MiddlewareProvider(provider as IProvider<IMiddleware>);

export class MiddlewareProvider extends ProviderDecorator<IMiddleware> {
  constructor(private provider: IProvider<IMiddleware>) {
    super(provider);
  }

  resolve(requestScope: IContainer, ...args: unknown[]): IMiddleware {
    return requestScope.resolve(Middleware, { args: [() => this.provider.resolve(requestScope, ...args)] });
  }
}
