import { RouteOptions } from '../../.generated/operations';

export interface IServerBuilder {
  addGetRoute(url: string, operationId: string, context: RouteOptions): this;

  addPostRoute(url: string, operationId: string, context: RouteOptions): this;

  addPutRoute(url: string, operationId: string, context: RouteOptions): this;

  addDeleteRoute(url: string, operationId: string, context: RouteOptions): this;
}
