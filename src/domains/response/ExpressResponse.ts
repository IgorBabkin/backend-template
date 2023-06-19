import { IResponse } from './IResponse';
import { Response } from 'express';

export abstract class ExpressResponse implements IResponse {
  constructor(private response: Response) {}

  sendError(statusCode: number, error: unknown): void {
    this.response.status(statusCode).send(this.serializeError(error));
  }

  protected abstract serializeError(error: unknown): object;
}
