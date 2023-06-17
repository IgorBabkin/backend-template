import { Response } from 'express';
import { IErrorHandler } from 'ts-request-mediator';
import { inject } from 'ts-constructor-injector';
import { createHttpErrorContext, IHttpErrorContext } from './IHttpErrorContext';
import {
  BadRequestErrorHandler,
  ForbiddenErrorHandler,
  InternalErrorHandler,
  NotFoundErrorHandler,
  ServiceUnavailableErrorHandler,
  UnAuthorizedRequestErrorHandler,
} from './HttpErrorHandler';

export class ExpressErrorHandler implements IErrorHandler<Response> {
  private readonly handler: IErrorHandler<IHttpErrorContext>;

  constructor(
    @inject(createHttpErrorContext)
    private createErrorContext: (response: Response) => IHttpErrorContext,
  ) {
    this.handler = new InternalErrorHandler();
    this.handler = new BadRequestErrorHandler(this.handler);
    this.handler = new UnAuthorizedRequestErrorHandler(this.handler);
    this.handler = new NotFoundErrorHandler(this.handler);
    this.handler = new ServiceUnavailableErrorHandler(this.handler);
    this.handler = new ForbiddenErrorHandler(this.handler);
  }

  handle(error: unknown, response: Response): void {
    this.handler.handle(error, this.createErrorContext(response));
  }
}
