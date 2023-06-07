import { ILogger } from '../../domains/ILogger';
import { Response } from 'express';
import { IHttpErrorContext } from '../IHttpErrorContext';

export abstract class ExpressErrorContext implements IHttpErrorContext {
  protected constructor(private logger: ILogger, private response: Response) {}

  logError(message: string, error: unknown): void {
    this.logger.error(message, error);
  }

  sendError(statusCode: number, error: unknown): void {
    this.response.status(statusCode).send(this.createMessage(error));
  }

  protected abstract createMessage(error: unknown): object;
}
