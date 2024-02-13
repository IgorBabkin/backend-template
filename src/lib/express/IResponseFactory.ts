import { Created, Ok } from '@ibabkin/openapi-to-server';

export const IResponseFactoryKey = Symbol('IResponseFactory');

export interface IResponseFactory {
  created(): Created;

  ok<T>(payload: T): Ok<T>;
}
