import { IMediator } from 'ts-request-mediator';
import { GetPaymentPayload, GetPaymentResponse, IRoute, Ok } from '../../.generated/operations';
import { GetPayment } from './GetPayment';
import { ok } from '../../lib/express/utils';

export class GetPaymentHttpRoute implements IRoute<GetPaymentPayload, Ok<GetPaymentResponse>> {
  constructor(private mediator: IMediator) {}

  async handle(payload: GetPaymentPayload): Promise<Ok<GetPaymentResponse>> {
    const response = await this.mediator.send(GetPayment, {
      paymentId: payload.params.paymentId,
    });
    return ok(response);
  }
}
