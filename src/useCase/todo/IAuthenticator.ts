import { accessor } from '../../lib/container/di';

export type AuthUserID = string;

export interface IAuthenticator {
  getUser(authToken: string): Promise<AuthUserID>;
}

export const IAuthenticatorKey = accessor<IAuthenticator>(Symbol('IAuthenticatorKey'));
