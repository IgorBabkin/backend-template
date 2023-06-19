import { Response } from 'express';
import { constructor, inject } from 'ts-constructor-injector';
import { IErrorHandler } from './useCase/errorHandler/IErrorHandler';
import { byArr } from './lib/container/di';
import { ExpressResponse } from './domains/response/ExpressResponse';
import { responseFactory } from './domains/response/IResponse';
import { by } from 'ts-ioc-container';
import { InternalErrorHandler } from './useCase/errorHandler/InternalErrorHandler';
import { BadRequestErrorHandler } from './useCase/errorHandler/BadRequestErrorHandler';
import { ForbiddenErrorHandler } from './useCase/errorHandler/ForbiddenErrorHandler';
import { NotFoundErrorHandler } from './useCase/errorHandler/NotFoundErrorHandler';
import { ServiceUnavailableErrorHandler } from './useCase/errorHandler/ServiceUnavailableErrorHandler';
import { UnAuthorizedRequestErrorHandler } from './useCase/errorHandler/UnAuthorizedRequestErrorHandler';
import { IExpressErrorHandler } from './lib/express/IExpressErrorHandler';

const HANDLERS: constructor<IErrorHandler>[] = [
  BadRequestErrorHandler,
  UnAuthorizedRequestErrorHandler,
  NotFoundErrorHandler,
  ServiceUnavailableErrorHandler,
  ForbiddenErrorHandler,
];

export class ExpressErrorHandler implements IExpressErrorHandler {
  constructor(
    @inject(byArr(...HANDLERS)) private handlers: IErrorHandler[],
    @inject(by(InternalErrorHandler)) private baseError: IErrorHandler,
    @inject(responseFactory) private createResponse: (response: Response) => ExpressResponse,
  ) {}

  handle(error: unknown, response: Response): void {
    const handler = this.handlers.find((handler) => handler.isMatch(error)) ?? this.baseError;
    return handler.handle(error, this.createResponse(response));
  }
}
