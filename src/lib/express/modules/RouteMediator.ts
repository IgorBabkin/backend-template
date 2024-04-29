import { IContainer, Provider } from 'ts-ioc-container';
import { HttpResponse, Route, RouteOptions } from '@ibabkin/openapi-to-server';
import { ZodType } from 'zod';
import { Scope } from '../../components/Scope';
import { AppRequestContext, IRequestContext, IRequestContextKey } from '../../components/RequestContext';

export class RouteMediator {
  private routes = new Map<string, string>();

  constructor(
    private operations: Record<string, (scope: IContainer) => Route<unknown, HttpResponse>>,
    private validators: Record<string, ZodType>,
    private appScope: IContainer,
  ) {}

  addPath(operationId: string, path: string) {
    this.routes.set(operationId, path);
  }

  async handleRequest(
    operation: (scope: IContainer) => Route<unknown, HttpResponse>,
    payloadValidator: ZodType,
    data: unknown,
    options: RouteOptions & { baseURI: () => string },
  ) {
    const requestScope = this.appScope.createScope(Scope.Request);
    requestScope.register(
      IRequestContextKey.key,
      Provider.fromValue<IRequestContext>(new AppRequestContext(this.routes, options.tags, options.baseURI)),
    );
    try {
      return await operation(requestScope).handle(payloadValidator.parse(data), options);
    } finally {
      requestScope.dispose();
    }
  }

  getValidator(operationId: string) {
    const validator = this.validators[operationId];
    if (!validator) {
      throw new Error(`Validator ${operationId} not found`);
    }
    return validator;
  }

  getOperation(operationId: string) {
    const operation = this.operations[operationId];
    if (!operation) {
      throw new Error(`Operation ${operationId} not found`);
    }
    return operation;
  }
}
