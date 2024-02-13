import express, { Express } from 'express';
import http, { Server } from 'http';
import { IServerBuilder, IServerBuilderModule } from './IServerBuilder';

export class ExpressServerBuilder implements IServerBuilder {
  private server = express();

  addExpressModule(module: (app: Express) => void): this {
    module(this.server);
    return this;
  }

  useModule(module: IServerBuilderModule): this {
    module.applyTo(this);
    return this;
  }

  build(): Server {
    return http.createServer(this.server);
  }
}
