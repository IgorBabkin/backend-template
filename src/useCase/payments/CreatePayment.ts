import { IQueryHandler } from '@ibabkin/ts-request-mediator';
import { IPaymentRepo, IPaymentRepoKey } from '../../domains/payments/IPaymentRepo';
import { inject } from '@ibabkin/ts-constructor-injector';
import { by } from '@ibabkin/ts-ioc-container';

interface PaymentDTO {}

export interface ICreatePaymentQuery {}

export class CreatePayment implements IQueryHandler<ICreatePaymentQuery, PaymentDTO> {
  constructor(@inject(by(IPaymentRepoKey)) private paymentRepo: IPaymentRepo) {}
  async handle(query: ICreatePaymentQuery): Promise<PaymentDTO> {
    const payment = await this.paymentRepo.create({});
    return {};
  }
}
