import { createLogger, ILogger } from '../../domains/logger/ILogger';
import { Response } from 'express';
import { DomainError } from '../../domains/errors/DomainError';
import {
  DomainErrorHandler,
  HttpError,
  IExpressErrorHandlerStrategy,
  IExpressErrorHandlerStrategyKey,
} from './DomainErrorHandler';
import { perApplication } from '../../lib/container/di';
import { inject, key } from 'ts-ioc-container';

@perApplication
@key(IExpressErrorHandlerStrategyKey)
export class DevErrorHandleStrategy implements IExpressErrorHandlerStrategy {
  constructor(@inject(createLogger('DomainErrorHandler')) private logger: ILogger) {}

  sendHttpError(response: Response, { statusCode, error }: HttpError): void {
    this.logger.logError(`StatusCode: ${statusCode}`, error);
    response.status(statusCode).send(this.serializeError(error));
  }

  protected serializeError(error: unknown): object {
    if (error instanceof DomainError) {
      return {
        message: error.message,
        stack: error.getStack(),
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
      };
    }

    return {
      message: error,
    };
  }
}
