import { IResponse } from '../../domains/response/IResponse';

export interface IErrorHandler {
  isMatch(error: unknown): boolean;
  handle(error: unknown, response: IResponse): void;
}
