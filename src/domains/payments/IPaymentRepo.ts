import { IPayment, IPaymentValue } from './IPayment';

export interface IPaymentRepo {
  create(value: IPaymentValue): Promise<IPayment>;
}

export const IPaymentRepoKey = Symbol('IPaymentRepo');
