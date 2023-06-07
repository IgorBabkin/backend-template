import { Resolvable } from '@ibabkin/ts-ioc-container';
import { Fn } from '@ibabkin/ts-constructor-injector';

export const IEnvKey = Symbol('IEnv');

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export interface IEnv {
  port: number;
  logLevel: LogLevel;
  production: boolean;
}

export const env =
  <T extends keyof IEnv>(key: T): Fn<Resolvable, IEnv[T]> =>
  (l) =>
    l.resolve<IEnv>(IEnvKey)[key];
