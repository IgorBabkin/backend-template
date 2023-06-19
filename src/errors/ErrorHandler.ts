import { constructor, inject } from 'ts-constructor-injector';
import HttpError from 'standard-http-error';
import { EntityNotFoundError } from '../domains/errors/EntityNotFoundError';
import { createLogger, ILogger } from '../domains/logger/ILogger';
import { IResponse } from './response/IResponse';

export interface ErrorHandler {
  isMatch(error: unknown): boolean;
  handle(error: unknown, response: IResponse): void;
}

export class InternalErrorHandler implements ErrorHandler {
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

abstract class DefaultErrorHandler implements ErrorHandler {
  protected abstract errors: constructor<Error>[];
  protected abstract statusCode: number;

  protected constructor(private logger: ILogger) {}

  isMatch(error: unknown): boolean {
    return this.errors.some((Target) => error instanceof Target);
  }

  handle(error: unknown, response: IResponse): void {
    this.logger.logError(`StatusCode: ${this.statusCode}`, error);
    response.sendError(this.statusCode, error);
  }
}

export class BadRequestErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [EntityNotFoundError];
  protected statusCode = HttpError.BAD_REQUEST;
  constructor(@inject(createLogger('BadRequestErrorHandler')) logger: ILogger) {
    super(logger);
  }
}

export class ForbiddenErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.FORBIDDEN;

  constructor(@inject(createLogger('ForbiddenErrorHandler')) logger: ILogger) {
    super(logger);
  }
}

export class NotFoundErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.NOT_FOUND;

  constructor(@inject(createLogger('NotFoundErrorHandler')) logger: ILogger) {
    super(logger);
  }
}

export class ServiceUnavailableErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.SERVICE_UNAVAILABLE;

  constructor(@inject(createLogger('ServiceUnavailableErrorHandler')) logger: ILogger) {
    super(logger);
  }
}

export class UnAuthorizedRequestErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.UNAUTHORIZED;

  constructor(@inject(createLogger('UnAuthorizedRequestErrorHandler')) logger: ILogger) {
    super(logger);
  }
}
