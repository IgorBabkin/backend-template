import { IHttpErrorContext } from './IHttpErrorContext';
import { constructor } from '@ibabkin/ts-constructor-injector';
import { ErrorHandler, IErrorHandler } from '@ibabkin/ts-request-mediator';
import HttpError from 'standard-http-error';
import { EntityNotFoundError } from '../domains/errors/EntityNotFoundError';

export class InternalErrorHandler implements IErrorHandler<IHttpErrorContext> {
  private statusCode = HttpError.INTERNAL_SERVER_ERROR;

  handle(error: unknown, context: IHttpErrorContext): void {
    context.logError(`StatusCode: ${this.statusCode}`, error);
    context.sendError(this.statusCode, error);
  }
}

abstract class DefaultErrorHandler extends ErrorHandler<IHttpErrorContext> {
  protected abstract errors: constructor<Error>[];
  protected abstract statusCode: number;

  protected handleError(error: Error, context: IHttpErrorContext): void {
    context.logError(`StatusCode: ${this.statusCode}`, error);
    context.sendError(this.statusCode, error);
  }
}

export class BadRequestErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [EntityNotFoundError];
  protected statusCode = HttpError.BAD_REQUEST;
}

export class ForbiddenErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.FORBIDDEN;
}

export class NotFoundErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.NOT_FOUND;
}

export class ServiceUnavailableErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.SERVICE_UNAVAILABLE;
}

export class UnAuthorizedRequestErrorHandler extends DefaultErrorHandler {
  protected errors: constructor<Error>[] = [];
  protected statusCode = HttpError.UNAUTHORIZED;
}
