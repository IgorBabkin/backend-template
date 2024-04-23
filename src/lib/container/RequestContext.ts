import { accessor } from './utils';
import { IContainer } from 'ts-ioc-container';

export interface IRequestContext {
  tags: string[];
}

export const IRequestContext = accessor<IRequestContext>(Symbol('IRequestContext'));

export const requestContext =
  <Key extends keyof IRequestContext>(key: Key) =>
  (s: IContainer) =>
    IRequestContext.resolve(s)[key];
