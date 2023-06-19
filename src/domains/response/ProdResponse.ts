import { ExpressResponse } from './ExpressResponse';
import { forKey } from 'ts-ioc-container';
import { IResponseKey } from './IResponse';

@forKey(IResponseKey)
export class ProdResponse extends ExpressResponse {
  protected serializeError(error: unknown): object {
    return error instanceof Error
      ? {
          code: error.name,
          message: error.message,
        }
      : {
          message: error,
        };
  }
}
