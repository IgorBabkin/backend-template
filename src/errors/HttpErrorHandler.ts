import { IHttpErrorContext } from './IHttpErrorContext';
import { constructor } from '@ibabkin/ts-constructor-injector';
import { ErrorHandler, IErrorHandler } from '@ibabkin/ts-request-mediator';
import HttpError from 'standard-http-error';

abstract class HttpErrorHandler extends ErrorHandler<IHttpErrorContext> {
  protected abstract statusCode: number;
  protected abstract errors: constructor<Error>[];

  protected handleError(error: Error, context: IHttpErrorContext): void {
    context.logError(`StatusCode: ${this.statusCode}`, error);
    context.sendError(this.statusCode, error);
  }
}

export class InternalErrorHandler implements IErrorHandler<IHttpErrorContext> {
  private statusCode = HttpError.INTERNAL_SERVER_ERROR;

  handle(error: unknown, context: IHttpErrorContext): void {
    context.logError(`StatusCode: ${this.statusCode}`, error);
    context.sendError(this.statusCode, error);
  }
}

export class BadRequestErrorHandler extends HttpErrorHandler {
  protected statusCode = HttpError.BAD_REQUEST;
  protected errors: constructor<Error>[] = [];
}

export class ForbiddenErrorHandler extends HttpErrorHandler {
  protected statusCode = HttpError.FORBIDDEN;
  protected errors: constructor<Error>[] = [];
}

export class NotFoundErrorHandler extends HttpErrorHandler {
  protected statusCode = HttpError.NOT_FOUND;
  protected errors: constructor<Error>[] = [];
}

export class ServiceUnavailableErrorHandler extends HttpErrorHandler {
  protected statusCode = HttpError.SERVICE_UNAVAILABLE;
  protected errors: constructor<Error>[] = [];
}

export class UnAuthorizedRequestErrorHandler extends HttpErrorHandler {
  protected statusCode = HttpError.UNAUTHORIZED;
  protected errors: constructor<Error>[] = [];
}
