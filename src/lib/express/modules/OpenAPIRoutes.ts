import { IServerBuilder, IServerBuilderModule } from '../IServerBuilder';
import { OpenAPIV3 } from 'openapi-types';
import { HttpResponse, Route, RouteOptions } from '@ibabkin/openapi-to-server';
import { Request, Response } from 'express';
import { ZodType } from 'zod';
import { IContainer, Provider } from 'ts-ioc-container';
import { Scope } from '../../mediator/Scope';
import { IRequestContext } from '../../container/RequestContext';

export class OpenAPIRoutes implements IServerBuilderModule {
  constructor(
    private doc: OpenAPIV3.Document,
    private operations: Record<string, (scope: IContainer) => Route<unknown, HttpResponse>>,
    private validators: Record<string, ZodType>,
    private appScope: IContainer,
  ) {}

  applyTo(builder: IServerBuilder): void {
    for (const [path, p] of Object.entries(this.doc.paths)) {
      const url = path.replace(/{/g, ':').replace(/}/g, '');
      const route = p?.get ?? p?.post ?? p?.put ?? p?.delete;

      if (!route) {
        throw new Error(`No route found for path ${path}`);
      }

      const operationId = route.operationId!;
      const operation = this.getOperation(operationId);
      const payloadValidator = this.getValidator(operationId);
      const options = { tags: route.tags ?? [] };

      if (p?.get) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        builder.addExpressModule((server) => {
          server.get(url, (req, res, next) =>
            this.handleRequest(operation, payloadValidator, options, { req, res }).catch((e) => next(e)),
          );
        });
      }
      if (p?.post) {
        builder.addExpressModule((server) => {
          server.post(url, (req, res, next) =>
            this.handleRequest(operation, payloadValidator, options, { req, res }).catch((e) => next(e)),
          );
        });
      }
      if (p?.put) {
        builder.addExpressModule((server) => {
          server.put(url, (req, res, next) =>
            this.handleRequest(operation, payloadValidator, options, { req, res }).catch((e) => next(e)),
          );
        });
      }
      if (p?.delete) {
        builder.addExpressModule((server) => {
          server.delete(url, (req, res, next) =>
            this.handleRequest(operation, payloadValidator, options, { req, res }).catch((e) => next(e)),
          );
        });
      }
    }
  }

  private async handleRequest(
    operation: (scope: IContainer) => Route<unknown, HttpResponse>,
    validator: ZodType,
    options: RouteOptions,
    { req, res }: { req: Request; res: Response },
  ) {
    const requestScope = this.appScope.createScope(Scope.Request);
    requestScope.register(IRequestContext.key, Provider.fromValue<IRequestContext>(options));
    try {
      const { status, payload } = await operation(requestScope).handle(validator.parse(req), options);
      return res.status(status).header('ContentType', 'application/json').send(payload);
    } finally {
      requestScope.dispose();
    }
  }

  private getValidator(operationId: string) {
    const validator = this.validators[operationId];
    if (!validator) {
      throw new Error(`Validator ${operationId} not found`);
    }
    return validator;
  }

  private getOperation(operationId: string) {
    const operation = this.operations[operationId];
    if (!operation) {
      throw new Error(`Operation ${operationId} not found`);
    }
    return operation;
  }
}
