import { Resolver } from '../../lib/container/di';

export interface ILogger {
  info(message: string, meta?: object): void;

  debug(message: string, meta?: object): void;

  warn(message: string, meta?: object): void;

  error(message: string, meta?: object): void;

  http(message: string, meta?: object): void;

  logError(message: string, error: unknown, meta?: object): void;
}

export const ILoggerKey = Symbol('ILogger');

export const createLogger =
  (topic: string): Resolver<ILogger> =>
  (c) =>
    c.resolve(ILoggerKey, { topic });
