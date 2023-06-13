import express, { Express, NextFunction, Request, Response } from 'express';
import http, { Server } from 'http';
import { IServerBuilder } from './IServerBuilder';
import { Validator } from './Validator';
import { AppMediator } from './AppMediator';
import * as console from 'console';

// eslint-disable-next-line @typescript-eslint/ban-types
export class ExpressServerBuilder implements IServerBuilder {
  private server = express();

  constructor(private mediator: AppMediator, private validator: Validator) {}

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

  addDeleteRoute(url: string, operationId: string): this {
    this.server.delete(url, (req, res, next) => this.handleRequest(operationId, { req, res, next }));
    return this;
  }

  addGetRoute(url: string, operationId: string): this {
    console.log('addGetRoute', url, operationId);
    this.server.get(url, (req, res, next) => this.handleRequest(operationId, { req, res, next }));
    return this;
  }

  addPostRoute(url: string, operationId: string): this {
    this.server.post(url, (req, res, next) => this.handleRequest(operationId, { req, res, next }));
    return this;
  }

  addPutRoute(url: string, operationId: string): this {
    this.server.put(url, (req, res, next) => this.handleRequest(operationId, { req, res, next }));
    return this;
  }

  private handleRequest(operationId: string, { req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      return this.mediator
        .send(operationId, this.validator.parse(operationId, req))
        .then(({ status, payload }) => res.status(status).header('ContentType', 'application/json').send(payload))
        .catch(next);
    } catch (e) {
      next(e);
    }
  }
}
