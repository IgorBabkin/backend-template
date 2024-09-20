import { accessor } from '../../lib/container/di';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { perScope } from '../../lib/components/Scope';
import { Brand } from '../../lib/brand';

export type AuthUserID = Brand<string, 'AuthUserID'>;

export interface IAuthenticator {
  getUser(authToken: string): Promise<AuthUserID>;
}

export const IAuthenticatorKey = accessor<IAuthenticator>(Symbol('IAuthenticatorKey'));

@register(IAuthenticatorKey.register, scope(perScope.Application))
@provider(singleton())
export class Authenticator implements IAuthenticator {
  async getUser(authToken: string): Promise<AuthUserID> {
    return '123' as AuthUserID;
  }
}
