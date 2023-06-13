import { IMediator } from '@ibabkin/ts-request-mediator';
import { GetPaymentHttpRoute } from './GetPaymentHttpRoute';

export const payments = (mediator: IMediator) => ({
  getPayment: new GetPaymentHttpRoute(mediator),
});
