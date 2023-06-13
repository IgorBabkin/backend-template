export interface IServerBuilder {
  addGetRoute(url: string, operationId: string): this;

  addPostRoute(url: string, operationId: string): this;

  addPutRoute(url: string, operationId: string): this;

  addDeleteRoute(url: string, operationId: string): this;
}
