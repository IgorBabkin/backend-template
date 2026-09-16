import { Logger } from 'winston';
import { arg, bindTo, inject, register } from 'ts-ioc-container';
import { ILogger, ILoggerKey } from './ILogger';
import { DomainError } from '../errors/DomainError';

interface SerializedError {
  errorName?: string;
  errorMessage: string;
  errorStack?: string;
}

@register(bindTo(ILoggerKey))
export class WinstonLogger implements ILogger {
  constructor(@inject(arg(1)) private logger: Logger, @inject(arg(0)) private meta: { topic: string }) {}

  info(message: string, meta: object = {}): void {
    this.logger.info(`${message}; meta: ${this.createMeta(meta)}`);
  }

  debug(message: string, meta: object = {}): void {
    this.logger.debug(`${message}; meta: ${this.createMeta(meta)}`);
  }

  error(message: string, meta: object = {}): void {
    this.logger.error(`${message}; meta: ${this.createMeta(meta)}`);
  }

  http(message: string, meta: object = {}): void {
    this.logger.http(`${message}; meta: ${this.createMeta(meta)}`);
  }

  warn(message: string, meta?: object): void {
    this.logger.warn(`${message}; meta: ${this.createMeta(meta)}`);
  }

  logError(message: string, error: unknown, meta: object = {}): void {
    this.logger.error(`${message}; meta: ${this.createMeta({ ...WinstonLogger.serializeError(error), ...meta })}`);
  }

  private createMeta(meta: object = {}): string {
    return Object.entries({
      ...this.meta,
      ...meta,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  }

  private static serializeError(error: unknown): SerializedError {
    if (error instanceof DomainError) {
      return {
        ...error.meta,
        errorName: error.name,
        errorMessage: error.message,
      };
    } else if (error instanceof Error) {
      return {
        errorName: error.name,
        errorMessage: error.message,
      };
    } else {
      return { errorMessage: `${error}` };
    }
  }
}
