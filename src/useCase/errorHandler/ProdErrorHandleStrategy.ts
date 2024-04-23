import { createLogger, ILogger } from '../../domains/logger/ILogger';
import { DomainError } from '../../domains/errors/DomainError';
import { IExpressErrorHandlerStrategy, IExpressErrorHandlerStrategyKey, Payload } from './DomainErrorHandler';
import { inject, key, register, scope } from 'ts-ioc-container';
import { asSingleton } from '../../lib/container/di';
import { Response } from 'express';
import { Scope } from 'ts-request-mediator';

@asSingleton
@register(key(IExpressErrorHandlerStrategyKey), scope((c) => c.hasTag(Scope.Application)))
export class ProdErrorHandleStrategy implements IExpressErrorHandlerStrategy {
  constructor(@inject(createLogger('ErrorHandler')) private logger: ILogger) {}

  sendHttpError(response: Response, { statusCode, error }: Payload): void {
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
