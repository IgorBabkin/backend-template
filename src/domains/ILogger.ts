import { Resolver } from '../lib/container/di';

export interface ILogger {
  info(message: string): void;

  error(message: string, error: unknown): void;
}

export const ILoggerKey = Symbol('ILogger');

export const createLogger =
  (name: string): Resolver<ILogger> =>
  (c) =>
    c.resolve(ILoggerKey, name);
