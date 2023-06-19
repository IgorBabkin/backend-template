import { DefaultErrorHandler } from './DefaultErrorHandler';
import { EntityNotFoundError } from '../../domains/errors/EntityNotFoundError';
import HttpError from 'standard-http-error';
import { inject, constructor } from 'ts-constructor-injector';
import { createLogger, ILogger } from '../../domains/logger/ILogger';

export class BadRequestErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [EntityNotFoundError];
  protected statusCode = HttpError.BAD_REQUEST;

  constructor(@inject(createLogger('BadRequestErrorHandler')) logger: ILogger) {
    super(logger);
  }
}
