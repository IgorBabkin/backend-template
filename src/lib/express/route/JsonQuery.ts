import { Response } from 'express';
import { IMediator } from '@ibabkin/ts-request-mediator';
import { IExpressRoute, IExpressRouteContext } from '../IExpressRoute';

export abstract class JsonQuery<QueryResponse = unknown> implements IExpressRoute {
  async handle({ response, mediator }: IExpressRouteContext): Promise<Response> {
    return response
      .status(200)
      .contentType('application/json')
      .send(await this.process(mediator));
  }

  protected abstract process(mediator: IMediator): Promise<QueryResponse>;
}
