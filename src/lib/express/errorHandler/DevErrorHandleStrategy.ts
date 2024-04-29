import { createLogger, ILogger } from '../../../domains/logger/ILogger';
import { Response } from 'express';
import { DomainError } from '../../../domains/errors/DomainError';
import { IExpressErrorHandlerStrategy, IExpressErrorHandlerStrategyKey, Payload } from './DomainErrorHandler';
import { inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { perScope } from '../../components/Scope';

@register(key(IExpressErrorHandlerStrategyKey), scope(perScope.Application))
@provider(singleton())
export class DevErrorHandleStrategy implements IExpressErrorHandlerStrategy {
  constructor(@inject(createLogger('DomainErrorHandler')) private logger: ILogger) {}

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
