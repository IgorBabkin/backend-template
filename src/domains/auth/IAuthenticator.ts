import { accessor } from '../../lib/container/di';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { perScope } from '../../lib/components/Scope';

export type AuthUserID = string;

export interface IAuthenticator {
  getUser(authToken: string): Promise<AuthUserID>;
}

export const IAuthenticatorKey = accessor<IAuthenticator>(Symbol('IAuthenticatorKey'));

@register(IAuthenticatorKey.register, scope(perScope.Application))
@provider(singleton())
export class Authenticator implements IAuthenticator {
  async getUser(authToken: string): Promise<AuthUserID> {
    return '123';
  }
}
