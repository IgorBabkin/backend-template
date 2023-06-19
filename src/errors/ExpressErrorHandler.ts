import { Response } from 'express';
import { IErrorHandler } from 'ts-request-mediator';
import { constructor, inject } from 'ts-constructor-injector';
import {
  BadRequestErrorHandler,
  ErrorHandler,
  ForbiddenErrorHandler,
  InternalErrorHandler,
  NotFoundErrorHandler,
  ServiceUnavailableErrorHandler,
  UnAuthorizedRequestErrorHandler,
} from './ErrorHandler';
import { byArr } from '../lib/container/di';
import { ExpressResponse } from './response/ExpressResponse';
import { responseFactory } from './response/IResponse';
import { by } from 'ts-ioc-container';

const HANDLERS: constructor<ErrorHandler>[] = [
  BadRequestErrorHandler,
  UnAuthorizedRequestErrorHandler,
  NotFoundErrorHandler,
  ServiceUnavailableErrorHandler,
  ForbiddenErrorHandler,
];

export class ExpressErrorHandler implements IErrorHandler<Response> {
  constructor(
    @inject(byArr(...HANDLERS)) private handlers: ErrorHandler[],
    @inject(by(InternalErrorHandler)) private baseError: ErrorHandler,
    @inject(responseFactory) private createResponse: (response: Response) => ExpressResponse,
  ) {}

  handle(error: unknown, response: Response): void {
    const handler = this.handlers.find((handler) => handler.isMatch(error)) ?? this.baseError;
    return handler.handle(error, this.createResponse(response));
  }
}
