import { accessor } from '../container/di';

export interface IRequestContext {
  tags: string[];
}

export const IRequestContext = accessor<IRequestContext>(Symbol('IRequestContext'));
