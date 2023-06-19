import { ILogger } from '../../domains/logger/ILogger';
import { IResponse } from '../../domains/response/IResponse';
import { IErrorHandler } from './IErrorHandler';
import { constructor } from 'ts-constructor-injector';

export abstract class DefaultErrorHandler implements IErrorHandler {
  protected abstract errors: constructor<Error>[];
  protected abstract statusCode: number;

  protected constructor(private logger: ILogger) {}

  isMatch(error: unknown): boolean {
    return this.errors.some((Target) => error instanceof Target);
  }

  handle(error: unknown, response: IResponse): void {
    this.logger.logError(`StatusCode: ${this.statusCode}`, error);
    response.sendError(this.statusCode, error);
  }
}
