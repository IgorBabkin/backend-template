import { NextFunction, Request, Response } from 'express';
import { PersistenceError } from '../../domains/errors/PersistenceError';
import { EntityNotFoundError } from '../../domains/errors/EntityNotFoundError';
import { by, inject } from 'ts-ioc-container';
import { IServerBuilder, IServerBuilderModule } from '../../lib/express/IServerBuilder';

export type HttpError = {
  statusCode: number;
  error: unknown;
};

export const IExpressErrorHandlerStrategyKey = Symbol('IExpressErrorHandlerStrategy');

export interface IExpressErrorHandlerStrategy {
  sendHttpError(response: Response, { statusCode, error }: HttpError): void;
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
      this.strategy.sendHttpError(response, { statusCode: 400, error });
    }
  }

  private internalServerError(error: unknown, response: Response): void {
    this.strategy.sendHttpError(response, { statusCode: 500, error });
  }
}
