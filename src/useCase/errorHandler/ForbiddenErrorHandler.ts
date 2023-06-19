import { DefaultErrorHandler } from './DefaultErrorHandler';
import HttpError from 'standard-http-error';
import { inject, constructor } from 'ts-constructor-injector';
import { createLogger, ILogger } from '../../domains/logger/ILogger';

export class ForbiddenErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.FORBIDDEN;

  constructor(@inject(createLogger('ForbiddenErrorHandler')) logger: ILogger) {
    super(logger);
  }
}
