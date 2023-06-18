import express, { Express, Request, Response } from 'express';
import http, { Server } from 'http';
import { IServerBuilder } from './IServerBuilder';
import { HttpResponse, Route, RouteOptions } from '../../.generated/operations';
import { ZodType } from 'zod';

export class ExpressServerBuilder implements IServerBuilder {
  private server = express();

  constructor(
    private operations: Record<string, Route<unknown, HttpResponse<unknown>>>,
    private validators: Record<string, ZodType>,
  ) {}

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

  addDeleteRoute(url: string, operationId: string, options: RouteOptions): this {
    this.server.delete(url, (req, res, next) =>
      this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
    );
    return this;
  }

  addGetRoute(url: string, operationId: string, options: RouteOptions): this {
    this.server.get(url, (req, res, next) =>
      this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
    );
    return this;
  }

  addPostRoute(url: string, operationId: string, options: RouteOptions): this {
    this.server.post(url, (req, res, next) =>
      this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
    );
    return this;
  }

  addPutRoute(url: string, operationId: string, options: RouteOptions): this {
    this.server.put(url, (req, res, next) =>
      this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
    );
    return this;
  }

  private async handleRequest(
    operationId: string,
    { req, res }: { req: Request; res: Response },
    options: RouteOptions,
  ) {
    const { status, payload } = await this.handleOperation(
      operationId,
      this.validatePayload(operationId, req),
      options,
    );
    return res.status(status).header('ContentType', 'application/json').send(payload);
  }

  private handleOperation(operationId: string, data: unknown, options: RouteOptions) {
    const operation = this.operations[operationId];
    if (!operation) {
      throw new Error(`Operation ${operationId} not found`);
    }
    return operation.handle(data, options);
  }

  private validatePayload(operationId: string, data: unknown) {
    const validator = this.validators[operationId];
    if (!validator) {
      throw new Error(`Validator ${operationId} not found`);
    }
    return validator.parse(data);
  }
}
