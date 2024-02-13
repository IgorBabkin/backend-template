import { IServerBuilder, IServerBuilderModule } from './IServerBuilder';
import { OpenAPIV3 } from 'openapi-types';
import { HttpResponse, Route, RouteOptions } from '../../.generated/operations';
import { Request, Response } from 'express';
import { ZodType } from 'zod';

export class OpenAPIRoutes implements IServerBuilderModule {
  constructor(
    private doc: OpenAPIV3.Document,
    private operations: Record<string, Route<unknown, HttpResponse<unknown>>>,
    private validators: Record<string, ZodType>,
  ) {
  }

  applyTo(builder: IServerBuilder): void {
    for (const [path, p] of Object.entries(this.doc.paths)) {
      const url = path.replace(/{/g, ':').replace(/}/g, '');
      const route = p?.get ?? p?.post ?? p?.put ?? p?.delete;

      if (!route) {
        throw new Error(`No route found for path ${path}`);
      }

      const options = { tags: route.tags ?? [] };
      const operationId = route.operationId!;

      if (p?.get) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        builder.addExpressModule((server) => {
          server.get(url, (req, res, next) =>
            this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
          );
        });
      }
      if (p?.post) {
        builder.addExpressModule((server) => {
          server.post(url, (req, res, next) =>
            this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
          );
        });
      }
      if (p?.put) {
        builder.addExpressModule((server) => {
          server.put(url, (req, res, next) =>
            this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
          );
        });
      }
      if (p?.delete) {
        builder.addExpressModule((server) => {
          server.delete(url, (req, res, next) =>
            this.handleRequest(operationId, { req, res }, options).catch((e) => next(e)),
          );
        });
      }
    }
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
