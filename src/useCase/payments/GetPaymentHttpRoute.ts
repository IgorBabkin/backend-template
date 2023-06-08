import { JsonQuery } from '../../lib/express/route/JsonQuery';
import { GetPayment, IGetPaymentQuery } from './GetPayment';
import { IMediator } from '@ibabkin/ts-request-mediator';
import { z } from 'zod';
import { Request } from 'express';
import { GET } from '../../lib/express/expressDecorators';

const schema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

@GET('/payments/:id')
export class GetPaymentHttpRoute extends JsonQuery implements IGetPaymentQuery {
  paymentId: string;

  constructor(request: Request) {
    super();
    const { params } = schema.parse(request);
    this.paymentId = params.id;
  }

  protected process(mediator: IMediator) {
    return mediator.send(GetPayment, this);
  }
}
