import { Response } from 'express';
import { Resolvable } from 'ts-ioc-container';

export interface IHttpErrorContext {
  logError(message: string, error: unknown): void;

  sendError(statusCode: number, error: unknown): void;
}
export const IHttpErrorContextKey = Symbol('IHttpErrorContext');

export const createHttpErrorContext = (c: Resolvable) => (response: Response) =>
  c.resolve(IHttpErrorContextKey, response);
