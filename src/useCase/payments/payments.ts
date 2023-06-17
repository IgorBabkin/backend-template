import { IMediator } from 'ts-request-mediator';
import { GetPaymentHttpRoute } from './GetPaymentHttpRoute';

export const payments = (mediator: IMediator) => ({
  getPayment: new GetPaymentHttpRoute(mediator),
});
