import { IMediator } from '@ibabkin/ts-request-mediator';
import { Response } from 'express';

export interface IExpressRouteContext {
  mediator: IMediator;
  response: Response;
}

export interface IExpressRoute {
  handle(context: IExpressRouteContext): Promise<Response>;
}
