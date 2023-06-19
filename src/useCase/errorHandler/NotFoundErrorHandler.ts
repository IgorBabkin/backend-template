import { DefaultErrorHandler } from './DefaultErrorHandler';
import HttpError from 'standard-http-error';
import { inject, constructor } from 'ts-constructor-injector';
import { createLogger, ILogger } from '../../domains/logger/ILogger';

export class NotFoundErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.NOT_FOUND;

  constructor(@inject(createLogger('NotFoundErrorHandler')) logger: ILogger) {
    super(logger);
  }
}
