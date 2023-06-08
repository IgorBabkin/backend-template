import { IPayment, IPaymentValue } from './IPayment';

export interface IPaymentRepo {
  create(value: IPaymentValue): Promise<IPayment>;

  findByIdOrFail(paymentId: string): Promise<IPayment>;
}

export const IPaymentRepoKey = Symbol('IPaymentRepo');
