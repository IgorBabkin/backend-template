import { IQueryHandler } from '@ibabkin/ts-request-mediator';
import { IPaymentRepo, IPaymentRepoKey } from '../../domains/payments/IPaymentRepo';
import { inject } from '@ibabkin/ts-constructor-injector';
import { by } from '@ibabkin/ts-ioc-container';

type PaymentDTO = {
  id: string;
};

export interface IGetPaymentQuery {
  paymentId: string;
}

export class GetPayment implements IQueryHandler<IGetPaymentQuery, PaymentDTO> {
  constructor(@inject(by(IPaymentRepoKey)) private paymentRepo: IPaymentRepo) {}

  async handle(query: IGetPaymentQuery): Promise<PaymentDTO> {
    const payment = await this.paymentRepo.findByIdOrFail(query.paymentId);
    return {
      id: payment.id,
    };
  }
}
