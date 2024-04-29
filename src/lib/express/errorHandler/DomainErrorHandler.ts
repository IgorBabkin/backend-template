import { NextFunction, Request, Response } from 'express';
import { PersistenceError } from '../../../domains/errors/PersistenceError';
import { EntityNotFoundError } from '../../../domains/errors/EntityNotFoundError';
import { by, inject } from 'ts-ioc-container';
import { IServerBuilder, IServerBuilderModule } from '../IServerBuilder';
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
  constructor(@inject(by.key(IExpressErrorHandlerStrategyKey)) private strategy: IExpressErrorHandlerStrategy) {}

  applyTo(builder: IServerBuilder): void {
    builder.addExpressModule((app) => {
      app.use((error: unknown, req: Request, response: Response, next: NextFunction) => {
        if (error instanceof PersistenceError || error instanceof EntityNotFoundError) {
          return this.strategy.sendHttpError(response, { statusCode: HttpError.BAD_REQUEST, error });
        }

        return this.strategy.sendHttpError(response, { statusCode: HttpError.INTERNAL_SERVER_ERROR, error });
      });
    });
  }
}
