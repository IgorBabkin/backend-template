import { DefaultErrorHandler } from './DefaultErrorHandler';
import HttpError from 'standard-http-error';
import { createLogger, ILogger } from '../../domains/logger/ILogger';
import { constructor, inject } from 'ts-constructor-injector';

export class ServiceUnavailableErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.SERVICE_UNAVAILABLE;

  constructor(@inject(createLogger('ServiceUnavailableErrorHandler')) logger: ILogger) {
    super(logger);
  }
}
