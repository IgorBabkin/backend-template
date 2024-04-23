import { IMediator } from './IMediator';
import { IQueryHandler } from './IQueryHandler';
import { getHooks, hook } from 'ts-ioc-container';

export class SimpleMediator implements IMediator {
  async send<TResponse, TQuery>(useCase: IQueryHandler<TQuery, TResponse>, query: TQuery): Promise<TResponse> {
    for (const methodName of getHooks(useCase, 'SimpleMediator/BeforeHook')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const r = useCase[methodName](query);
      if (r instanceof Promise) {
        await r;
      }
    }

    const result = await useCase.handle(query);

    for (const methodName of getHooks(useCase, 'SimpleMediator/AfterHook')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const r = useCase[methodName](query, result);
      if (r instanceof Promise) {
        await r;
      }
    }

    return result;
  }
}

export const before = hook('SimpleMediator/BeforeHook');
export const after = hook('SimpleMediator/AfterHook');
