import { Response } from 'express';
import { IExpressErrorHandler } from '../../lib/express/IExpressErrorHandler';
import { PersistenceError } from '../../domains/errors/PersistenceError';
import { EntityNotFoundError } from '../../domains/errors/EntityNotFoundError';
import { by, inject } from 'ts-ioc-container';

export type HttpError = {
  statusCode: number;
  error: unknown;
};

export const IExpressErrorHandlerStrategyKey = Symbol('IExpressErrorHandlerStrategy');

export interface IExpressErrorHandlerStrategy {
  sendHttpError(response: Response, { statusCode, error }: HttpError): void;
}

export class DomainErrorHandler implements IExpressErrorHandler {
  constructor(@inject(by(IExpressErrorHandlerStrategyKey)) private strategy: IExpressErrorHandlerStrategy) {}

  handle(error: unknown, response: Response): void {
    this.badRequest(error, response);
    this.internalServerError(error, response);
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
