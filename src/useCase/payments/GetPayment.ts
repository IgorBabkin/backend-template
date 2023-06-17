import { IQueryHandler } from 'ts-request-mediator';
import { IPaymentRepo, IPaymentRepoKey } from '../../domains/payments/IPaymentRepo';
import { inject } from 'ts-constructor-injector';
import { by } from 'ts-ioc-container';
import { GetPaymentResponse } from '../../.generated/operations';

export interface IGetPaymentQuery {
  paymentId: string;
}

export class GetPayment implements IQueryHandler<IGetPaymentQuery, GetPaymentResponse> {
  constructor(@inject(by(IPaymentRepoKey)) private paymentRepo: IPaymentRepo) {}

  async handle(query: IGetPaymentQuery): Promise<GetPaymentResponse> {
    const payment = await this.paymentRepo.findByIdOrFail(query.paymentId);
    return {
      id: payment.id,
    };
  }
}
