import express, { Express } from 'express';
import { constructor } from '@ibabkin/ts-constructor-injector';
import { getRoute } from './expressDecorators';
import http, { Server } from 'http';
import { IMediator } from '@ibabkin/ts-request-mediator';
import { IExpressRoute } from './IExpressRoute';
import { IServerBuilder } from './IServerBuilder';

// eslint-disable-next-line @typescript-eslint/ban-types
export class ExpressServerBuilder implements IServerBuilder {
  static fromMediator(mediator: IMediator): ExpressServerBuilder {
    return new ExpressServerBuilder(express(), mediator);
  }

  constructor(private server: Express, private mediator: IMediator) {}

  addRoute(Route: constructor<IExpressRoute>): this {
    const { method, url } = getRoute(Route);
    this.server[method](url, (req, res, next) => {
      try {
        const query = new Route(req);
        return query.handle({ response: res, mediator: this.mediator }).catch((err) => {
          next(err);
        });
      } catch (e) {
        next(e);
      }
    });
    return this;
  }

  addExpressModule(module: (app: Express) => void): this {
    module(this.server);
    return this;
  }

  addBuilderModule(module: (builder: IServerBuilder) => void): this {
    module(this);
    return this;
  }

  build(): Server {
    return http.createServer(this.server);
  }
}
