import { inject } from '@ibabkin/ts-constructor-injector';
import { createLogger, ILogger } from '../../domains/ILogger';
import { Response } from 'express';
import { IHttpErrorContextKey } from '../IHttpErrorContext';
import { forKey } from '@ibabkin/ts-ioc-container';
import { ExpressErrorContext } from './ExpressErrorContext';

@forKey(IHttpErrorContextKey)
export class ProdErrorContext extends ExpressErrorContext {
  constructor(@inject(createLogger('ErrorLogger')) logger: ILogger, response: Response) {
    super(logger, response);
  }

  protected createMessage(error: unknown): object {
    return error instanceof Error
      ? {
          code: error.name,
          message: error.message,
        }
      : {
          message: error,
        };
  }
}
