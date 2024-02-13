import { NextFunction, Request, Response } from 'express';
import { PersistenceError } from '../../domains/errors/PersistenceError';
import { EntityNotFoundError } from '../../domains/errors/EntityNotFoundError';
import { by, inject } from 'ts-ioc-container';
import { IServerBuilder, IServerBuilderModule } from '../../lib/express/IServerBuilder';
import HttpError from 'standard-http-error';

export type Payload = {
  statusCode: number;
  error: unknown;
};

export const IExpressErrorHandlerStrategyKey = Symbol('IExpressErrorHandlerStrategy');

export interface IExpressErrorHandlerStrategy {
  sendHttpError(response: Response, { statusCode, error }: Payload): void;
}

export class DomainErrorHandler implements IServerBuilderModule {
  constructor(@inject(by(IExpressErrorHandlerStrategyKey)) private strategy: IExpressErrorHandlerStrategy) {
  }

  applyTo(builder: IServerBuilder): void {
    builder.addExpressModule((app) => {
      app.use((err: unknown, req: Request, response: Response, next: NextFunction) => {
        this.badRequest(err, response);
        this.internalServerError(err, response);
      });
    });
  }

  private badRequest(error: unknown, response: Response): void {
    if (error instanceof PersistenceError || error instanceof EntityNotFoundError) {
      this.strategy.sendHttpError(response, { statusCode: HttpError.BAD_REQUEST, error });
    }
  }

  private internalServerError(error: unknown, response: Response): void {
    this.strategy.sendHttpError(response, { statusCode: HttpError.INTERNAL_SERVER_ERROR, error });
  }
}
