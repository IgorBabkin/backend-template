import { Response } from 'express';

export interface IExpressErrorHandler {
  handle(error: unknown, response: Response): void;
}
