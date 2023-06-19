import HttpError from 'standard-http-error';
import { inject } from 'ts-constructor-injector';
import { createLogger, ILogger } from '../../domains/logger/ILogger';
import { IResponse } from '../../domains/response/IResponse';
import { IErrorHandler } from './IErrorHandler';

export class InternalErrorHandler implements IErrorHandler {
  private statusCode = HttpError.INTERNAL_SERVER_ERROR;

  constructor(@inject(createLogger('InternalErrorHandler')) private logger: ILogger) {}

  isMatch(): boolean {
    return true;
  }

  handle(error: unknown, response: IResponse): void {
    this.logger.logError(`StatusCode: ${this.statusCode}`, error);
    response.sendError(this.statusCode, error);
  }
}
