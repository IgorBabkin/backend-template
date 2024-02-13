import { Express } from 'express';

export interface IServerBuilder {
  useModule(module: IServerBuilderModule): this;

  addExpressModule(module: (app: Express) => void): this;
}

export interface IServerBuilderModule {
  applyTo(builder: IServerBuilder): void;
}
