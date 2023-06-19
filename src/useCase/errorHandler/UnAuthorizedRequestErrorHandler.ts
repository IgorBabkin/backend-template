import { DefaultErrorHandler } from './DefaultErrorHandler';
import HttpError from 'standard-http-error';
import { inject, constructor } from 'ts-constructor-injector';
import { createLogger, ILogger } from '../../domains/logger/ILogger';

export class UnAuthorizedRequestErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.UNAUTHORIZED;

  constructor(@inject(createLogger('UnAuthorizedRequestErrorHandler')) logger: ILogger) {
    super(logger);
  }
}
