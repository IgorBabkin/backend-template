import { ExpressResponse } from './ExpressResponse';
import { forKey } from 'ts-ioc-container';
import { IResponseKey } from './IResponse';

@forKey(IResponseKey)
export class DevResponse extends ExpressResponse {
  protected serializeError(error: unknown): object {
    return error instanceof Error
      ? {
          code: error.name,
          message: error.message,
          stack: error.stack,
        }
      : {
          message: error,
        };
  }
}
