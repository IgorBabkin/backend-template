import { HttpResponse, IRoute } from '../../.generated/operations';

export class AppMediator {
  constructor(private operations: Record<string, IRoute<unknown, HttpResponse<unknown>>>) {}

  send(operationId: string, data: unknown): Promise<HttpResponse<unknown>> {
    const operation = this.operations[operationId];
    if (!operation) {
      throw new Error(`Operation ${operationId} not found`);
    }
    return operation.handle(data);
  }
}
