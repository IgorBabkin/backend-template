import { perApplication } from '../container/di';
import { key } from 'ts-ioc-container';
import { Created, Ok } from '@ibabkin/openapi-to-server';
import { IResponseFactory, IResponseFactoryKey } from './IResponseFactory';

@perApplication
@key(IResponseFactoryKey)
export class ResponseFactory implements IResponseFactory {
  created(): Created {
    return { status: 201, payload: undefined };
  }

  ok<T>(payload: T): Ok<T> {
    return { status: 200, payload };
  }
}
