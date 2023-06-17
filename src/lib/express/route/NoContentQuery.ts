import { Response } from 'express';
import { IMediator } from 'ts-request-mediator';
import { IExpressRoute, IExpressRouteContext } from '../IExpressRoute';

export abstract class NoContentQuery implements IExpressRoute {
  async handle({ response, mediator }: IExpressRouteContext): Promise<Response> {
    await this.process(mediator);
    return response.status(204).send();
  }

  protected abstract process(mediator: IMediator): Promise<void>;
}
