import express, { Express, NextFunction, Request, Response } from 'express';
import http, { Server } from 'http';
import { IServerBuilder } from './IServerBuilder';
import { HttpResponse, IRoute } from '../../.generated/operations';
import { ZodType } from 'zod';

export class ExpressServerBuilder implements IServerBuilder {
  private server = express();

  constructor(
    private operations: Record<string, IRoute<unknown, HttpResponse<unknown>>>,
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

  addDeleteRoute(url: string, operationId: string): this {
    this.server.delete(url, (req, res, next) => this.handleRequest(operationId, { req, res, next }));
    return this;
  }

  addGetRoute(url: string, operationId: string): this {
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
      return this.handleOperation(operationId, this.validatePayload(operationId, req))
        .then(({ status, payload }) => res.status(status).header('ContentType', 'application/json').send(payload))
        .catch(next);
    } catch (e) {
      next(e);
    }
  }

  private handleOperation(operationId: string, data: unknown) {
    const operation = this.operations[operationId];
    if (!operation) {
      throw new Error(`Operation ${operationId} not found`);
    }
    return operation.handle(data);
  }

  private validatePayload(operationId: string, data: unknown) {
    const validator = this.validators[operationId];
    if (!validator) {
      throw new Error(`Validator ${operationId} not found`);
    }
    return validator.parse(data);
  }
}
