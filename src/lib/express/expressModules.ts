import { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ILogger } from '../../domains/logger/ILogger';
import { OpenAPIV3 } from 'openapi-types';
import { IServerBuilder } from './IServerBuilder';
import { IExpressErrorHandler } from './IExpressErrorHandler';

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

export function handleError(errorHandler: IExpressErrorHandler) {
  return (app: Express) => {
    app.use((err: unknown, req: Request, response: Response, next: NextFunction) => {
      errorHandler.handle(err, response);
    });
  };
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function openapiRoutes(doc: OpenAPIV3.Document) {
  return (builder: IServerBuilder) => {
    for (const [path, p] of Object.entries(doc.paths)) {
      const url = path.replace(/{/g, ':').replace(/}/g, '');
      const route = p?.get ?? p?.post ?? p?.put ?? p?.delete;

      if (!route) {
        throw new Error(`No route found for path ${path}`);
      }

      const options = { tags: route.tags ?? [] };
      const operationId = route.operationId!;

      if (p?.get) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        builder.addGetRoute(url, operationId!, options);
      }
      if (p?.post) {
        builder.addPostRoute(url, operationId!, options);
      }
      if (p?.put) {
        builder.addPutRoute(url, operationId!, options);
      }
      if (p?.delete) {
        builder.addDeleteRoute(url, operationId!, options);
      }
    }
  };
}
