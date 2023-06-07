import { CreatePayment, ICreatePaymentQuery } from './CreatePayment';
import { JsonQuery } from '../../lib/express/route/JsonQuery';
import { z } from 'zod';
import { GET } from '../../lib/express/expressDecorators';
import { Request } from 'express';
import { IMediator } from '@ibabkin/ts-request-mediator';

const schema = z.object({
  query: z.object({}),
  body: z.object({}),
  params: z.object({}),
});

@GET('/waste_stream')
export class CreatePaymentHttpRoute extends JsonQuery implements ICreatePaymentQuery {
  constructor(request: Request) {
    super();
    const { query, body, params } = schema.parse(request);
  }

  protected process(mediator: IMediator) {
    return mediator.send(CreatePayment, this);
  }
}
