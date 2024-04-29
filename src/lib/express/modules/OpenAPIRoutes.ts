import { IServerBuilder, IServerBuilderModule } from '../IServerBuilder';
import { OpenAPIV3 } from 'openapi-types';
import { HttpResponse } from '@ibabkin/openapi-to-server';
import { Response } from 'express';
import { RouteMediator } from './RouteMediator';

export class OpenAPIRoutes implements IServerBuilderModule {
  constructor(private doc: OpenAPIV3.Document, private mediator: RouteMediator) {}

  applyTo(builder: IServerBuilder): void {
    for (const [path, p] of Object.entries(this.doc.paths)) {
      const url = path.replace(/{/g, ':').replace(/}/g, '');

      if (p?.get) {
        this.mediator.addPath(p?.get.operationId!, path);
        this.addGET(builder, url, p?.get);
      }
      if (p?.post) {
        this.mediator.addPath(p?.post.operationId!, path);
        this.addPOST(builder, url, p?.post);
      }
      if (p?.put) {
        this.mediator.addPath(p?.put.operationId!, path);
        this.addPUT(builder, url, p?.put);
      }
      if (p?.delete) {
        this.mediator.addPath(p?.delete.operationId!, path);
        this.addDELETE(builder, url, p?.delete);
      }
    }
  }

  private addGET(builder: IServerBuilder, url: string, { operationId, tags }: OpenAPIV3.OperationObject) {
    const operation = this.mediator.getOperation(operationId!);
    const payloadValidator = this.mediator.getValidator(operationId!);

    builder.addExpressModule((server) => {
      server.get(url, (req, res, next) =>
        this.mediator
          .handleRequest(operation, payloadValidator, req, { tags: tags ?? [] })
          .then((r) => this.sendResponse(res, r))
          .catch((e) => next(e)),
      );
    });
  }

  private addPOST(builder: IServerBuilder, url: string, { operationId, tags }: OpenAPIV3.OperationObject) {
    const operation = this.mediator.getOperation(operationId!);
    const payloadValidator = this.mediator.getValidator(operationId!);

    builder.addExpressModule((server) => {
      server.post(url, (req, res, next) =>
        this.mediator
          .handleRequest(operation, payloadValidator, req, { tags: tags ?? [] })
          .then((r) => this.sendResponse(res, r))
          .catch((e) => next(e)),
      );
    });
  }

  private addPUT(builder: IServerBuilder, url: string, { operationId, tags }: OpenAPIV3.OperationObject) {
    const operation = this.mediator.getOperation(operationId!);
    const payloadValidator = this.mediator.getValidator(operationId!);

    builder.addExpressModule((server) => {
      server.put(url, (req, res, next) =>
        this.mediator
          .handleRequest(operation, payloadValidator, req, { tags: tags ?? [] })
          .then((r) => this.sendResponse(res, r))
          .catch((e) => next(e)),
      );
    });
  }

  private addDELETE(builder: IServerBuilder, url: string, { operationId, tags }: OpenAPIV3.OperationObject) {
    const operation = this.mediator.getOperation(operationId!);
    const payloadValidator = this.mediator.getValidator(operationId!);

    builder.addExpressModule((server) => {
      server.delete(url, (req, res, next) =>
        this.mediator
          .handleRequest(operation, payloadValidator, req, { tags: tags ?? [] })
          .then((r) => this.sendResponse(res, r))
          .catch((e) => next(e)),
      );
    });
  }

  private sendResponse(res: Response, data: HttpResponse) {
    res.status(data.status).header('ContentType', 'application/json');

    if (data.headers.Location) {
      res.header('Location', data.headers.Location);
    }

    res.send(data.body);
  }
}
