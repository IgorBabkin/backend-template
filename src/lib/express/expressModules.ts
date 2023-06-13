import { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { IErrorHandler } from '@ibabkin/ts-request-mediator';
import { ILogger } from '../../domains/logger/ILogger';
import { OpenAPIV3 } from 'openapi-types';
import { IServerBuilder } from './IServerBuilder';

export function bodyParsing(app: Express) {
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
}

export function logRequests(logger: ILogger) {
  return (app: Express) => {
    app.use((req, res, next) => {
      logger.http('processing request', { url: req.originalUrl, body: req.body });
      next();
    });
  };
}

export function handleNotFound(app: Express) {
  app.use((req: Request, res: Response) => {
    res.status(404).send("Sorry can't find that!");
  });
}

export function handleError(errorHandler: IErrorHandler<Response>) {
  return (app: Express) => {
    app.use((err: unknown, req: Request, response: Response, next: NextFunction) => {
      errorHandler.handle(err, response);
    });
  };
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function swaggerRoutes(doc: OpenAPIV3.Document) {
  return (builder: IServerBuilder) => {
    for (const [path, p] of Object.entries(doc.paths)) {
      const url = path.replace(/{/g, ':').replace(/}/g, '');
      if (p?.get) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        builder.addGetRoute(url, p.get.operationId!);
      }
      if (p?.post) {
        builder.addPostRoute(url, p.post.operationId!);
      }
      if (p?.put) {
        builder.addPutRoute(url, p.put.operationId!);
      }
      if (p?.delete) {
        builder.addDeleteRoute(url, p.delete.operationId!);
      }
    }
  };
}
